var f = Object.defineProperty;
var g = (i, e, t) => e in i ? f(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var d = (i, e, t) => (g(i, typeof e != "symbol" ? e + "" : e, t), t);
class m {
  constructor(e, t) {
    d(this, "element");
    d(this, "config");
    this.config = t, this.attach(e);
  }
  attach(e) {
    if (!(e instanceof HTMLElement)) {
      console.error("Element must be of type 'HTMLElement'.");
      return;
    }
    if (e.contentEditable !== "true") {
      console.error(
        `Element does not have 'contenteditable="true"' attribute.`
      );
      return;
    }
    this.element && this.detach(), e.addEventListener("keyup", () => this.keyupHandler()), this.element = e;
  }
  detach() {
    this.element ? (this.element.removeEventListener("keyup", () => this.keyupHandler()), this.element = void 0) : console.warn("Detach failed, element is not attached");
  }
  get transformations() {
    return this.config.transformations ?? [];
  }
  set transformations(e) {
    this.config.transformations = e;
  }
  keyupHandler() {
    const e = this.getPrecedingText(), t = this.getLastWordInText(e);
    for (const { query: r, value: n, appendSpace: o } of this.config.transformations) {
      const s = r instanceof RegExp, c = e.length - t.length, l = s ? t.match(r) : null;
      if (l || r === t && !s) {
        let a = typeof n == "function" ? n(t, r, l) : n;
        (o ?? !0) && (a += " "), this.replaceHtml(a, c, c + t.length);
        const h = new CustomEvent("replace", {
          detail: {
            oldValue: t,
            newValue: a,
            config: { query: r, value: n, appendSpace: o }
          }
        });
        this.element.dispatchEvent(h);
      }
    }
  }
  replaceHtml(e, t, r) {
    const n = window.getSelection();
    let o = document.createRange();
    n != null && n.anchorNode && (o.setStart(n == null ? void 0 : n.anchorNode, t), o.setEnd(n.anchorNode, r)), o.deleteContents();
    const s = document.createElement("div");
    s.innerHTML = e;
    const c = document.createDocumentFragment();
    let l, a;
    for (; l = s.firstChild; )
      a = c.appendChild(l);
    o.insertNode(c), a && (o = o.cloneRange(), o.setStartAfter(a), o.collapse(!0), n == null || n.removeAllRanges(), n == null || n.addRange(o));
  }
  getPrecedingText() {
    var o, s;
    let e = "";
    const t = (o = window.getSelection()) == null ? void 0 : o.anchorNode, r = t == null ? void 0 : t.textContent, n = (s = window.getSelection()) == null ? void 0 : s.getRangeAt(0).startOffset;
    return r && n && n >= 0 && (e = r.substring(0, n)), e;
  }
  getLastWordInText(e) {
    e = e.replace(/\u00A0/g, " ");
    const t = e.split(/\s+/), r = t.length - 1;
    return t[r].trim();
  }
}
export {
  m as default
};
