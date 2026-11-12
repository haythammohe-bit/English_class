/* Business English Book — core helpers + fixed-page pager */
(function (W) {
  'use strict';
  const B = (W.BK = W.BK || {});

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const WORD = "[A-Za-z0-9](?:[A-Za-z0-9'’\\-\\/&%+.]*[A-Za-z0-9%])?";
  const LAT = new RegExp(WORD + "(?:(?:[ ]+|,[ ]*|[ ]*\\/[ ]*|[ ]*\\+[ ]*)" + WORD + ")*[.?!]*", 'g');

  // Arabic-context text: isolate every Latin run as LTR, support **bold**
  const fmt = s => {
    s = String(s == null ? '' : s);
    let out = '', last = 0, m;
    LAT.lastIndex = 0;
    while ((m = LAT.exec(s))) {
      out += esc(s.slice(last, m.index)) + '<span class="en">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    out += esc(s.slice(last));
    return out.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  };
  // pronunciation: *stressed* syllable in bold
  const pr = s => esc(s).replace(/\*(.+?)\*/g, '<b class="st">$1</b>');
  const h = (tag, cls, html) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };

  class Pager {
    constructor(root) {
      this.root = root; this.pages = []; this.cur = null; this.body = null;
      this.opts = {}; this.warns = []; this.anchors = {}; this._mk = null;
    }
    // start a fresh page with new section options
    begin(opts) { this.opts = opts || {}; return this.newPage(); }
    newPage(opts) {
      if (opts) this.opts = opts;
      const o = this.opts, n = this.pages.length + 1;
      const page = h('section', 'page ' + (o.cls || '') + (o.wk ? ' wk' + o.wk : ''));
      page.dataset.no = n; page.id = 'p' + n;
      if (!o.bare) page.appendChild(h('header', 'phead', '<span class="phl" dir="ltr">' + esc(o.runL || '') + '</span><span class="phr">' + fmt(o.runR || '') + '</span>'));
      const body = h('div', 'pbody' + (o.bodyCls ? ' ' + o.bodyCls : ''));
      page.appendChild(body);
      if (!o.bare) page.appendChild(h('footer', 'pfoot', '<span class="pbrand" dir="ltr">Business English · Warehouse &amp; Supply Chain</span><span class="pnum">' + n + '</span>'));
      this.root.appendChild(page);
      this.pages.push(page); this.cur = page; this.body = body;
      return page;
    }
    mark(key) { this._mk = key; }
    _landed() { if (this._mk) { this.anchors[this._mk] = this.pages.length; this._mk = null; } }
    fits() { return this.body.scrollHeight <= this.body.clientHeight + 1; }
    add(node) {
      if (!this.cur) this.newPage();
      this.body.appendChild(node);
      if (!this.fits()) {
        if (this.body.children.length > 1) {
          this.body.removeChild(node);
          this.newPage();
          this.body.appendChild(node);
        }
        if (!this.fits()) this.warns.push('Overflow on page ' + this.pages.length + ' (' + (node.className || node.tagName) + ')');
      }
      this._landed();
      return node;
    }
    group(nodes, cls) {
      const g = h('div', cls || 'grp');
      nodes.forEach(n => g.appendChild(n));
      return this.add(g);
    }
    // list of blocks: array entries are kept together
    addAll(list) { list.forEach(x => (Array.isArray(x) ? this.group(x) : this.add(x))); }
    // head node + items: head stays with the first item
    section(head, items) {
      if (!items.length) { this.add(head); return; }
      const k = items.length > 2 ? 2 : 1;
      this.group([head].concat(items.slice(0, k)));
      items.slice(k).forEach(n => this.add(n));
    }
    _row(r, spec) {
      const tr = h('tr', r.cls || '');
      const cc = spec.colCls || [], dirs = spec.dirs || [];
      tr.innerHTML = r.cells.map((c, k) => '<td class="' + (cc[k] || '') + '"' + (dirs[k] ? ' dir="' + dirs[k] + '"' : '') + '>' + c + '</td>').join('');
      return tr;
    }
    // table that splits across pages (header row repeats)
    table(spec) {
      const rows = spec.rows; let i = 0, guard = 0;
      if (!this.cur) this.newPage();
      while (i < rows.length) {
        if (++guard > rows.length * 2 + 10) throw new Error('table loop on page ' + this.pages.length);
        const wrap = h('div', 'tw');
        if (i === 0 && spec.pre) spec.pre.forEach(n => wrap.appendChild(n));
        const t = h('table', 'tbl ' + (spec.cls || ''));
        if (spec.head) t.appendChild(h('thead', null, '<tr>' + spec.head.map((c, k) => '<th class="' + ((spec.colCls || [])[k] || '') + '">' + c + '</th>').join('') + '</tr>'));
        const tb = h('tbody'); t.appendChild(tb); wrap.appendChild(t);
        this.body.appendChild(wrap);
        let added = 0; const start = i;
        while (i < rows.length) {
          const tr = this._row(rows[i], spec);
          tb.appendChild(tr);
          if (!this.fits()) { tb.removeChild(tr); break; }
          i++; added++;
        }
        if (added === 0) {
          this.body.removeChild(wrap);
          if (this.body.children.length > 0) { this.newPage(); continue; }
          tb.appendChild(this._row(rows[i], spec)); this.body.appendChild(wrap); i++;
          this.warns.push('Row overflow on page ' + this.pages.length);
        } else if (start === 0 && i < rows.length && added < (spec.minFirst || 3) && this.body.children.length > 1) {
          // orphan control: too few rows of a continuing table on this page, so move the whole first chunk to a fresh page
          this.body.removeChild(wrap); i = 0; this.newPage();
        } else {
          this._landed();
          if (i < rows.length) this.newPage();
        }
      }
    }
  }

  B.esc = esc; B.fmt = fmt; B.pr = pr; B.h = h; B.Pager = Pager;
})(window);
