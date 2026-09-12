(function () {
  let e = document.createElement(`link`).relList;
  if (e && e.supports && e.supports(`modulepreload`)) return;
  for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
  new MutationObserver((e) => {
    for (let t of e) {
      if (t.type === `childList`) {
        for (let e of t.addedNodes) {
          e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
        }
      }
    }
  }).observe(document, { childList: !0, subtree: !0 });
  function t(e) {
    let t = {};
    return e.integrity && (t.integrity = e.integrity),
      e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
      t.credentials = e.crossOrigin === `use-credentials`
        ? `include`
        : e.crossOrigin === `anonymous`
        ? `omit`
        : `same-origin`,
      t;
  }
  function n(e) {
    if (e.ep) return;
    e.ep = !0;
    let n = t(e);
    fetch(e.href, n);
  }
})();
var e = class extends Error {
    source;
    constructor(e) {
      let t = Error, n = t.stackTraceLimit;
      n !== void 0 && (t.stackTraceLimit = 0),
        super(),
        n !== void 0 && (t.stackTraceLimit = n),
        this.source = e;
    }
  },
  t = class extends Error {
    source;
    constructor(e, t) {
      super(t instanceof Error ? t.message : String(t), { cause: t }),
        this.source = e;
    }
  };
function n(e) {
  return e instanceof t ? e.cause : e;
}
var r = class extends Error {
    constructor() {
      super(``);
    }
  },
  i = class extends Error {
    constructor() {
      super(``);
    }
  },
  a = 1024,
  o = 2048,
  s = 4096,
  c = 1024,
  l = 2048,
  u = 4096,
  d = 8192,
  f = 16384,
  p = 32768,
  m = 65536,
  h = 1 << 17,
  g = {},
  _ = {};
function v(e) {
  return e === _ ? void 0 : e;
}
var ee = {}, te = Symbol(`refresh`), ne = new WeakMap(), re = new Set();
function ie(e) {
  let t = ne.get(e);
  if (t) return oe(t);
  let n = (e.o?.Tt)?.o?.Je, r = n ? oe(n) : null;
  return t = { nn: e, Oe: new Set(), tn: [[], []], rn: null, Ae: b, an: r },
    ne.set(e, t),
    re.add(t),
    ae(e.o?.ye, t),
    ae(e.o?.Ce, t),
    t;
}
function ae(e, t) {
  if (!e) return;
  let n = ne.get(e);
  if (!n) return;
  let r = oe(n);
  r !== t && r.nn === e && !r.an && (r.an = t);
}
function oe(e) {
  for (; e.rn;) e = e.rn;
  return e;
}
function se(e, t) {
  if (e = oe(e), t = oe(t), e === t) return e;
  t.rn = e;
  for (let n of t.Oe) e.Oe.add(n);
  return t.Oe.clear(),
    e.tn[0].push(...t.tn[0]),
    e.tn[1].push(...t.tn[1]),
    t.tn[0].length = 0,
    t.tn[1].length = 0,
    e;
}
function ce(e) {
  let t = e.o?.Je;
  if (!t) return;
  let n = oe(t);
  if (re.has(n)) return n;
  e.o !== null && (e.o.Je = void 0);
}
function le(e) {
  if (ue(e) && e.o?.Nt) {
    let t = T(e).Nt = $e(e.o?.Nt);
    if (t.sn !== !0) return t;
    e.o !== null && (e.o.Nt = null);
  }
  return ce(e)?.Ae ?? e.Ae;
}
function ue(e) {
  let t = e.o;
  return t !== null && t.Pe !== void 0 && t.Pe !== g;
}
function de(e, t) {
  let n = oe(t), r = e.o?.Je;
  if (r) {
    if (r.rn) {
      T(e).Je = t, e.T |= c;
      return;
    }
    let i = oe(r);
    if (re.has(i)) {
      i !== n && !ue(e) &&
        (n.an && oe(n.an) === i
          ? (T(e).Je = t, e.T |= c)
          : i.an && oe(i.an) === n || se(n, i));
      return;
    }
  }
  T(e).Je = t, e.T |= c;
}
var fe = new Set(),
  pe = { eE: Array(2e3).fill(void 0), tE: !1, Qe: 0, EE: 0 },
  me = { eE: Array(2e3).fill(void 0), tE: !1, Qe: 0, EE: 0 };
function he(e) {
  e.ie & 16 ? e.ie &= -12 : (st(e, me), e.ie &= -4);
}
var y = 0, b = null, ge = !1, _e = !1, ve = !1, ye = 0, be = !1, xe = new Set();
function Se(e) {
  let t = e.m;
  return fe.size === 0 && re.size === 0 && e.Qt.length === 0 &&
    t.ze.length === 0 && t.A.length === 0 && t.En.size === 0 && xe.size === 0;
}
function Ce() {
  if (xe.size !== 0) {
    for (let e of xe) {
      if (e.u !== null) {
        xe.delete(e);
        continue;
      }
      e.Re === g && (e.o?.Pe === void 0 || e.o?.Pe === g) &&
        (e.o?.t || (xe.delete(e), e.o?.Et?.()));
    }
  }
}
function we(e) {
  be = e;
}
function Te() {
  return {
    Te: y,
    Lt: [],
    _e: new Map(),
    ze: [],
    A: [],
    En: new Set(),
    ue: [],
    Bt: { Mt: [[], []], Qt: [] },
    sn: !1,
    cn: new Set(),
  };
}
function Ee(e, t) {
  t.sn = e, e.ue.push(...t.ue);
  for (let n of re) n.Ae === t && (n.Ae = e);
  t.ze.length && (e.ze.push(...t.ze), t.ze.length = 0),
    t.A.length && (e.A.push(...t.A), t.A.length = 0);
  for (let n of t.En) e.En.add(n);
  let n = t.wt;
  if (n !== void 0) {
    t.wt = void 0;
    let r = e.wt;
    r === void 0 ? r = e.wt = n : r.push(...n);
    for (let e = 0; e < n.length; e++) {
      let t = n[e].pc;
      t !== void 0 && t.qe === n[e] && (t.qa = r);
    }
  }
  for (let [n, r] of t._e) {
    let t = e._e.get(n);
    t || e._e.set(n, t = new Set());
    for (let e of r) t.add(e);
  }
  for (let n of t.cn) e.cn.add(n);
}
function x() {
  if (_e) {
    Oe();
    return;
  }
  ge || (ge = !0, !ye && !C.fn && !be && queueMicrotask(Je));
}
function De(e) {
  if (_e) return;
  _e = !0;
  let t = `[REACTIVITY_HALTED]`;
  e === void 0 ? console.error(t) : console.error(t, e);
}
function Oe() {
  ve || (ve = !0, console.error(`[REACTIVITY_HALTED]`));
}
var ke = 0,
  Ae = class {
    ke = null;
    Mt = [[], []];
    Qt = [];
    jt = 0;
    created = y;
    addChild(e) {
      this.Qt.push(e), e.ke = this;
    }
    removeChild(e) {
      let t = this.Qt.indexOf(e);
      t >= 0 && (this.Qt.splice(t, 1), e.ke = null);
    }
    notify(e, t, n, r) {
      return this.ke ? this.ke.notify(e, t, n, r) : !1;
    }
    run(e) {
      if (this.Mt[e - 1].length) {
        let t = this.Mt[e - 1];
        this.Mt[e - 1] = [], Ye(t, e);
      }
      let t = this.Qt, n = ++ke;
      for (let r = 0; r < t.length;) {
        let i = t[r];
        if (i.jt !== n && (i.jt = n, i.run?.(e), t[r] !== i)) {
          r = 0;
          continue;
        }
        r++;
      }
    }
    enqueue(e, t) {
      e && (nn ? oe(nn).tn[e - 1].push(t) : this.Mt[e - 1].push(t)), x();
    }
    stashQueues(e) {
      e.Mt[0].push(...this.Mt[0]),
        e.Mt[1].push(...this.Mt[1]),
        this.Mt = [[], []];
      for (let t = 0; t < this.Qt.length; t++) {
        let n = this.Qt[t], r = e.Qt[t];
        r || (r = { Mt: [[], []], Qt: [] }, e.Qt[t] = r), n.stashQueues(r);
      }
    }
    restoreQueues(e) {
      this.Mt[0].push(...e.Mt[0]), this.Mt[1].push(...e.Mt[1]);
      for (let t = 0; t < e.Qt.length; t++) {
        let n = e.Qt[t], r = this.Qt[t];
        r && r.restoreQueues(n);
      }
    }
  },
  S = class e extends Ae {
    fn = !1;
    m = Te();
    static Fe;
    static He;
    static it;
    static qt = null;
    static p = null;
    static G = null;
    static M = null;
    static N = null;
    static Pt = null;
    static ht = null;
    static Ue = null;
    static de = null;
    static me = null;
    static un = null;
    static gt = null;
    static Ht = null;
    static kt = null;
    static et = null;
    static k = null;
    static Wt = null;
    static zt = null;
    static xt = null;
    static Tn = null;
    static dn = null;
    static In = null;
    static Nn = null;
    static ln = null;
    static vt = null;
    static Vt = null;
    static bt = null;
    static Be = null;
    static $e = null;
    static he = null;
    static Xe = null;
    static _n = null;
    flush() {
      if (!this.fn) {
        if (
          b === null && pe.EE < pe.Qe && this.Mt[0].length === 0 &&
          this.Mt[1].length === 0 && this.Qt.length === 0 && Se(this)
        ) {
          this.fn = !0;
          try {
            Mt(), He();
          } finally {
            this.fn = !1;
          }
          y++,
            ge = pe.EE >= pe.Qe || this.Mt[0].length !== 0 ||
              this.Mt[1].length !== 0 || this.m.Lt.length !== 0;
          return;
        }
        this.fn = !0;
        try {
          if (Mt(), ut(pe, e.Fe), b) {
            if (!Ze(b)) {
              let t = b;
              ut(me, this.m === t ? he : e.Fe),
                this.m === t && (qe = this.m = Te()),
                re.size && (e.Nn(1), e.Nn(2)),
                this.stashQueues(t.Bt),
                y++,
                ge = pe.EE >= pe.Qe || this.m.Lt.length > 0,
                Ke(t.Lt),
                b = null,
                Ue(null, !0);
              return;
            }
            let t = b, n = this.m;
            if (
              n !== t && n.Lt.push(...t.Lt),
                this.restoreQueues(t.Bt),
                fe.delete(t),
                b = null,
                Ke(n.Lt),
                Ue(t),
                n === t
            ) {
              let e = Te();
              e.Lt = n.Lt, e.ze = n.ze, e.A = n.A, e.En = n.En, qe = this.m = e;
            }
          } else {Se(this)
              ? (He(), pe.EE >= pe.Qe && (ut(pe, e.Fe), He()))
              : (fe.size && ut(me, e.Fe), Ue());}
          y++,
            ge = pe.EE >= pe.Qe,
            re.size && e.Nn(1),
            this.run(1),
            re.size && e.Nn(2),
            this.run(2);
        } finally {
          this.fn = !1;
        }
      }
    }
    notify(t, n, r, i) {
      if (n & 1) {
        if (r & 1) {
          let n = i === void 0 ? t.o?._ : i;
          if (n?.l) return !0;
          if (b && n) {
            let r = n.source, i = b._e.get(r);
            i || b._e.set(r, i = new Set());
            let a = i.size;
            i.add(t), i.size !== a && (x(), e.zt?.(b));
          }
        }
        return !0;
      }
      return !1;
    }
    initTransition(e) {
      if (e && (e = $e(e), e.sn === !0 || e === b) || !e && b && b.Te === y) {
        return;
      }
      if (!b) b = e ?? Te();
      else if (e) {
        let t = b;
        Ee(e, t), fe.delete(t), b = e;
      }
      fe.add(b), b.Te = y;
      let t = this.m;
      if (t !== b) {
        for (let e = 0; e < t.Lt.length; e++) {
          let n = t.Lt[e];
          n.Ae = b, b.Lt.push(n);
        }
        for (let e = 0; e < t.ze.length; e++) {
          let n = t.ze[e];
          n.Ae = b, b.ze.push(n);
        }
        t.A.length && b.A.push(...t.A);
        for (let e of t.En) b.En.add(e);
        if (t.cn.size) {
          for (let e of t.cn) b.cn.add(e);
          t.cn.clear();
        }
        qe = this.m = b;
      }
      for (let e of re) e.Ae ||= b;
      x();
    }
  };
function je(e) {
  qe.Lt.push(e);
}
var Me = !1, Ne = 0;
function Pe() {
  Ne++;
}
function Fe() {
  Me = !0;
}
function Ie(e, t = !1) {
  e.It = Ne;
  let n = e.T,
    r = (n & 1024 ? e.o?.Je : void 0) || nn,
    i = !!(n & 512) && e.o?.We !== void 0,
    a = Me;
  for (let n = e.u; n !== null; n = n.ae) {
    let e = n.ce;
    if (
      a && (e.ie &= ~o),
        e.ie & 4 && n.Ft === e.Ke && n !== e.je && (e.ie |= s),
        i && e.T & 8
    ) {
      e.ie |= 256;
      continue;
    }
    t && r
      ? (e.ie |= 128, de(e, r))
      : t && (e.ie |= 128, e.o && (e.o.Je = void 0)), rt(e);
  }
}
function Le(e) {
  let t = e;
  if (!t.oe) {
    e.Re !== g && (e.be = e.Re, e.Re = g), e.T & 256 && S.un(e);
    return;
  }
  e.Re !== g &&
  (e.be = e.Re,
    e.Re = g,
    e.ge && e.ge !== 3 && (e.tt = !0),
    e.o && (e.o.De = !1)),
    t.Ne = !1,
    t.ie &= ~a,
    t.S & 1 || (t.S &= -5),
    t.o != null && (t.o.Ye !== null || t.o.qe !== null) && S.He(t, !1, !0),
    e.T & 256 && S.un(e);
}
var Re = null;
function ze(e) {
  Re = e;
}
var Be = null, Ve = [];
function He() {
  let e = qe.Lt;
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    Le(n), n.Ae = null, n.T & 131072 && (n.T &= ~h, Ve.push(n));
  }
  e.length = 0, Re?.(), Be?.(qe);
}
function Ue(e = null, t = !1) {
  let n = !t;
  n && He(), !t && C.Qt.length && We(C);
  let r = pe.EE >= pe.Qe;
  if (r && ut(pe, S.Fe), n) {
    r && He();
    let t = e ?? C.m;
    if (t.ze.length && S.Tn(t.ze), t.cn.size) {
      for (let e of t.cn) e.ie & 64 || rt(e);
      t.cn.clear(), x();
    }
    if (
      t.A.length && (S.G(t.A), C.Qt.length && We(C)),
        t.En.size && S.qt(t.En, e),
        Ve.length !== 0
    ) {
      for (; Ve.length;) Ie(Ve.pop());
      pe.EE >= pe.Qe && (ut(pe, S.Fe), He());
    }
    Ce(), re.size && S.In(e);
  }
}
function We(e) {
  for (let t of e.Qt) t.se?.(), We(t);
}
var Ge = 0;
function Ke(e) {
  for (let t = 0; t < e.length; t++) e[t].Ae = b;
}
var C = new S(), qe = C.m;
function Je(e) {
  if (e) {
    ye++;
    try {
      return e();
    } finally {
      try {
        Je();
      } finally {
        ye--;
      }
    }
  }
  if (!C.fn && !_e) { for (; ge || b;) C.flush(); }
}
function Ye(e, t) {
  for (let n = 0; n < e.length; n++) e[n](t);
}
function Xe(t, n) {
  if (t.ie & 96) return !1;
  if (t.o?.le?.has(n)) return !0;
  for (let e = t.ut; e; e = e.lt) {
    let t = e.ot;
    for (; t;) {
      if (t === n || t.st === n) return !0;
      t = t.o?.Tt;
    }
  }
  return !!(t.S & 1 && t.o?._ instanceof e && t.o?._.source === n);
}
function Ze(e) {
  if (e.sn) return !0;
  if (e.ue.length) return !1;
  let t = !0;
  for (let [n, r] of e._e) {
    let i = !1;
    for (let e of r) {
      if (Xe(e, n)) {
        i = !0;
        break;
      }
      r.delete(e);
    }
    if (!i) e._e.delete(n);
    else if (n.S & 1 && n.o?._?.source === n) {
      t = !1;
      break;
    }
  }
  return t && S.dn?.(e) && (t = !1), t && (e.sn = !0), t;
}
function Qe() {
  return Te();
}
function $e(e) {
  for (; e.sn && typeof e.sn == `object`;) e = e.sn;
  return e;
}
function et(e, t) {
  let n = b;
  try {
    return b = $e(e), t();
  } finally {
    b = n;
  }
}
function tt(e, t) {
  let n = b, r = C.m;
  try {
    return b = $e(e), qe = C.m = b, t();
  } finally {
    b = n, qe = C.m = r;
  }
}
function nt(e) {
  return e.ie & 32 ? me : pe;
}
function rt(e) {
  if (e.ge === 3) {
    let t = e;
    t.tt || (t.tt = !0, t.C.enqueue(2, t.yt));
    return;
  }
  let t = nt(e);
  t.Qe > e.Me && (t.Qe = e.Me), at(e, t);
}
function it(e, t) {
  let n = (e.ke?.Gt ? e.ke.Dt?.Me : e.ke?.Me) ?? -1;
  n >= e.Me && (e.Me = n + 1);
  let r = e.Me, i = t.eE[r];
  if (i === void 0) t.eE[r] = e;
  else {
    let t = i.ct;
    t.rt = e, e.ct = t, i.ct = e;
  }
  r > t.EE && (t.EE = r);
}
function at(e, t) {
  let n = e.ie;
  n & 1036 ||
    (n & 1
      ? e.ie = n & -4 | 10
      : (e.ie = n | 8, t.tE && !(n & 2) && (t.tE = !1)),
      n & 16 || it(e, t));
}
function ot(e, t) {
  let n = e.ie;
  n & 1052 || (e.ie = n | 16, it(e, t));
}
function st(e, t) {
  let n = e.ie;
  if (!(n & 24)) return;
  e.ie = n & -25;
  let r = e.Me;
  if (e.ct === e) t.eE[r] = void 0;
  else {
    let n = e.rt, i = t.eE[r], a = n ?? i;
    e === i ? t.eE[r] = n : e.ct.rt = n, a.ct = e.ct;
  }
  e.ct = e, e.rt = void 0;
}
function ct(e) {
  if (!e.tE) {
    e.tE = !0;
    for (let t = 0; t <= e.EE; t++) {
      for (let n = e.eE[t]; n !== void 0; n = n.rt) {
        n.ie & 8 && lt(n);
      }
    }
  }
}
function lt(e, t = 2) {
  let n = e.ie;
  if (!((n & 3) >= t)) {
    e.ie = n & -4 | t;
    for (let t = e.u; t !== null; t = t.ae) lt(t.ce, 1);
    if (e.T & 4096) {
      for (let t = e.o.i; t !== null; t = t.Se) {
        for (let e = t.u; e !== null; e = e.ae) lt(e.ce, 1);
      }
    }
  }
}
function ut(e, t) {
  for (e.tE = !1, e.Qe = 0; e.Qe <= e.EE; e.Qe++) {
    let n = e.eE[e.Qe];
    for (; n !== void 0;) n.ie & 8 ? t(n) : dt(n, e), n = e.eE[e.Qe];
  }
  e.EE = 0;
}
function dt(e, t) {
  st(e, t);
  let n = e.Me;
  for (let t = e.ut; t; t = t.lt) {
    let e = t.ot, r = e.st || e;
    r.oe && r.Me >= n && (n = r.Me + 1);
  }
  if (e.Me !== n) {
    e.Me = n;
    for (let t = e.u; t !== null; t = t.ae) ot(t.ce, nt(t.ce));
  }
}
var ft = {};
function pt(e) {
  let t = e.xe;
  for (; t;) {
    let e = t.ie;
    t.ie = e | 32,
      e & 24 && (st(t, e & 32 ? me : pe), e & 8 ? at(t, me) : ot(t, me)),
      pt(t),
      t = t.Le;
  }
}
function mt(e) {
  e.T &= -33, At(e);
}
function ht(e, t = !1, n) {
  let r = e.ie;
  if (r & 64) return;
  if (t) {
    e.ie = r | 64;
    let t = e;
    (t.o?.ye || t.o?.Ce) && S.un(t);
  }
  t && e.oe && e.o !== null && (e.o.Ie = null);
  let i = n ? e.o?.Ye ?? null : e.xe;
  for (; i;) {
    let e = i.Le, t = i;
    t.T &= -33, st(t, nt(t)), kt(t), ht(i, !0), i = e;
  }
  if (
    n ? e.o !== null && (e.o.Ye = null) : (e.xe = null, e.Ze = 0),
      t && !n && !(r & 32) && e.ke !== null && !(e.ke.ie & 64)
  ) {
    let t = e.ft, n = e.Le;
    t === null ? e.ke.xe = n : t.Le = n, n !== null && (n.ft = t), e.ft = null;
  }
  if (gt(e, n), t && e.Rt) {
    let t = e.Rt;
    e.Rt = void 0, t();
  }
}
function gt(e, t) {
  let n = t ? e.o?.qe : e.Ge;
  if (n) {
    if (Array.isArray(n)) {
      for (let e = 0; e < n.length; e++) {
        let t = n[e];
        t.call(t);
      }
    } else n.call(n);
    t ? e.o !== null && (e.o.qe = null) : e.Ge = null;
  }
}
function _t(e, t) {
  let n = e;
  for (; n.T & 4 && n.ke;) n = n.ke;
  if (n.id != null) return bt(n.id, t ? n.Ze++ : n.Ze);
  throw Error(``);
}
function vt(e) {
  return _t(e, !0);
}
function yt(e, t, n) {
  return e?.id ?? (t ? n?.id : n?.id == null ? void 0 : vt(n));
}
function bt(e, t) {
  let n = t.toString(36), r = n.length - 1;
  return e + (r ? String.fromCharCode(64 + r) : ``) + n;
}
function xt() {
  return en || tn ? ft : Yt ? w : null;
}
function St() {
  return w;
}
function Ct(e) {
  return w &&
    (w.Ge ? Array.isArray(w.Ge) ? w.Ge.push(e) : w.Ge = [w.Ge, e] : w.Ge = e),
    e;
}
function wt(e = !0) {
  ht(this, e);
}
function Tt(e) {
  let t = w,
    n = e?.transparent ?? !1,
    r = {
      id: yt(e, n, t),
      T: n ? 4 : 0,
      Gt: !0,
      Dt: t?.Gt ? t.Dt : t,
      xe: null,
      Le: null,
      ft: null,
      Ge: null,
      C: t?.C ?? C,
      we: t?.we || ee,
      Ze: 0,
      o: null,
      ke: t,
      dispose: wt,
    };
  if (t) {
    let e = t.xe;
    e === null ? t.xe = r : (r.Le = e, e.ft = r, t.xe = r);
  }
  return r;
}
function Et(e, t) {
  let n = Tt(t);
  return Cn(n, () => e(() => n.dispose()));
}
function Dt(e) {
  let t = e.ot, n = e.lt, r = e.ae, i = e.en;
  if (r === null ? t._t = i : r.en = i, i !== null) i.ae = r;
  else if (t.u = r, r === null) {
    t.o?.Et?.();
    let e = t;
    e.oe && e.T & 32 && !(e.ie & 32) && !(e.S & 1) && At(e);
  }
  return n;
}
function Ot(e) {
  let t = e.je, n = t === null ? e.ut : t.lt;
  if (n !== null) {
    do n = Dt(n); while (n !== null);
    t === null ? e.ut = null : t.lt = null;
  }
}
function kt(e) {
  let t = e.ut;
  if (t) {
    do t = Dt(t); while (t !== null);
    e.ut = null, e.je = null;
  }
}
function At(e) {
  st(e, nt(e)), kt(e), ht(e, !0);
}
var jt = new Set();
function Mt() {
  if (jt.size !== 0) {
    for (let e of jt) !e.u && e.T & 32 && !(e.S & 1) && !(e.ie & 96) && At(e);
    jt.clear();
  }
}
function Nt(e, t, n = !1) {
  let r = t.je;
  if (r !== null && r.ot === e) {
    r.ve &&= n;
    return;
  }
  let i = null, a = t.ie & 4;
  if (a && (i = r === null ? t.ut : r.lt, i !== null && i.ot === e)) {
    i.Ft = t.Ke, t.je = i, i.ve = n;
    return;
  }
  let o = e._t;
  if (o !== null && o.ce === t && (!a || o.Ft === t.Ke)) {
    a ? o.ve &&= n : o.ve = n;
    return;
  }
  let s = t.je = e._t = {
    ot: e,
    ce: t,
    lt: i,
    en: o,
    ae: null,
    Ft: t.Ke,
    ve: n,
  };
  r === null ? t.ut = s : r.lt = s, o === null ? e.u = s : o.ae = s, Pe();
}
function Pt(e, t) {
  return !e.o?.le?.has(t) && ((T(e).le ??= new Set()).add(t), !0);
}
function Ft(e, t) {
  let n = e.o?.le;
  return n?.delete(t) ? (n.size || (e.o.le = void 0), !0) : !1;
}
function It(e) {
  e.o !== null && (e.o.le = void 0);
}
function Lt(e, t) {
  T(e).fe = !0, t.source && Pt(e, t.source), e.S & 2 || Rt(e, t.source, t);
}
function Rt(t, n, r) {
  if (!n) {
    t.o !== null && (t.o._ = null);
    return;
  }
  if (r instanceof e && r.source === n) {
    T(t)._ = r;
    return;
  }
  let i = t.o?._;
  (!(i instanceof e) || i.source !== n) && (T(t)._ = new e(n));
}
function zt(e, t) {
  for (let n = e.u; n !== null; n = n.ae) t(n.ce, n);
  for (let n = e.o?.i ?? null; n !== null; n = n.Se) {
    for (let e = n.u; e !== null; e = e.ae) {
      t(e.ce, e);
    }
  }
}
function Bt(e) {
  e.oe && e.T & 32 && !e.u && !(e.ie & 32) && !(e.S & 1) && At(e);
}
function Vt(e) {
  let t,
    n = new Set(),
    r = (e) => {
      n.has(e) || (n.add(e), !e.u && e.T & 32 && (t ??= []).push(e), zt(e, r));
    };
  if (zt(e, r), t) { for (let e of t) Bt(e); }
}
function Ht(e, t) {
  let n = !1,
    r = new Set(),
    i = (e) => {
      r.has(e) || (r.add(e), e.o?._ === t && (rt(e), n = !0), zt(e, i));
    };
  zt(e, i), n && x();
}
function Ut(e) {
  Ft(e, e);
  let t = !1,
    n,
    r = new Set(),
    i = S.de,
    a = (o) => {
      if (r.has(o) || !Ft(o, e)) return;
      r.add(o), o.Te = y;
      let s = o.o?.le?.values().next().value, c = o.S & 2;
      s
        ? (c || Rt(o, s), i?.(o))
        : (o.S &= -2,
          c || Rt(o),
          i?.(o),
          o.o?.fe && (rt(o), t = !0),
          o.o !== null && (o.o.fe = !1),
          !o.u && o.T & 32 && (n ??= []).push(o)), zt(o, a);
    };
  if (zt(e, a), n) { for (let e of n) Bt(e); }
  t && x();
}
function Wt(e) {
  return typeof e == `object` && !!e && typeof e.then == `function`;
}
function Gt(e) {
  let t = e.o?.Ee;
  t != null && (e.o.Ee = null, t());
}
function Kt(t, n, r) {
  let i = !1, a = !1;
  if (
    typeof n == `object` && n && _n(() => {
      i = n[Symbol.asyncIterator], a = !i && Wt(n);
    }), !a && !i
  ) return t.o !== null && (t.o.Ie = null), t.Ne = !1, n;
  T(t).Ie = n;
  let o,
    s = () => {
      let e = le(t);
      if (e && t.S & 4 && !$e(e)._e.has(t)) {
        t.Ae = null;
        return;
      }
      C.initTransition(e);
    },
    c = (r) => {
      if (t.o?.Ie !== n) return;
      let i = r instanceof e;
      if (i && t.Ne) {
        t.o !== null && (t.o.Ie = null), Lt(t, r), t.Te = y;
        return;
      }
      s(), Jt(t, i ? 1 : 2, r), i && Ut(t), t.Te = y, i || Vt(t);
    },
    l = (e, i) => {
      if (t.o?.Ie !== n || t.ie & 130) return;
      s();
      let a = !!(t.S & 4), o = t.o?.De;
      Ot(t), qt(t), o && (t.o.De = !0);
      let c = ce(t);
      if (c && c.Oe.delete(t), r) r(e), a && qt(t, !0);
      else if (t.o?.Pe !== void 0) {
        t.Re === g && je(t),
          t.Re = e,
          S.Ue?.(t, e),
          ue(t) ? t.T & 16384 && S.he?.(t) : Ie(t),
          t.Te = y;
      } else if (c) {
        let n = t.ge, r = t.be, i = t.pe;
        try {
          (!n && a || !i || !i(e, r)) &&
            (t.be = e, t.Te = y, S.Ue?.(t, e), Ie(t, !0));
        } catch (e) {
          Jt(t, 2, e);
        }
      } else {try {
          D(t, () => e);
        } catch (e) {
          Jt(t, 2, e);
        }}
      t.Re === g && (t.Ne = !1, o && (t.o.De = !1)), Ut(t), x(), Je(), i?.();
    },
    u = () => t.T & 32 && !t.u && !(t.S & 1) ? (At(t), !0) : !1,
    d = (e, r) => {
      let i = e[Symbol.asyncIterator](),
        a = !1,
        s = !1,
        d = !r,
        f = () => {
          if (!s) {
            s = !0;
            try {
              let e = i.return?.();
              Wt(e) && e.then(void 0, () => {});
            } catch {}
          }
        };
      r ? r(f) : Ct(f), T(t).Ee = f;
      let p = () => {
          u() || m();
        },
        m = () => {
          let e, r, f = !1, h = !1, g = !0, _ = i.next();
          if (
            (Wt(_) ? _ : { then: (e) => void e(_) }).then((r) => {
              if (g && d) e = r, f = !0, r.done && (s = !0);
              else if (t.o?.Ie !== n) return;
              else {r.done
                  ? (s = !0, a ? (x(), Je()) : l(void 0), u())
                  : (a = !0, l(r.value, p));}
            }, (e) => {
              g && d ? (r = e, h = !0) : t.o?.Ie === n && (s = !0, c(e), u());
            }),
              g = !1,
              h
          ) {
            if (s = !0, c(r), d) throw r;
            return !0;
          }
          return f && !e.done ? (o = e.value, a = !0, m()) : f && e.done;
        },
        h = m();
      return d = !1, a || h;
    },
    f = null,
    p = (e, t) => {
      let n = !1;
      if (
        typeof e == `object` && e && _n(() => {
          n = e[Symbol.asyncIterator];
        }), !n
      ) return !1;
      let r = d(e, t);
      return t || (f = r), !0;
    };
  if (a) {
    let r = !1,
      i = !1,
      a,
      s = !0,
      d = (e) => {
        t.Ge ? Array.isArray(t.Ge) ? t.Ge.push(e) : t.Ge = [t.Ge, e] : t.Ge = e;
      };
    if (
      n.then((e) => {
        s
          ? (o = e, r = !0)
          : t.o?.Ie === n && !(t.ie & 64) && p(e, d) || (l(e), u());
      }, (e) => {
        s ? (a = e, i = !0) : (c(e), u());
      }),
        s = !1,
        i
    ) throw c(a), a;
    if (r) p(o) || (t.Ne = !1);
    else {
      if (t.Ne) return t.be;
      throw C.initTransition(le(t)), new e(w);
    }
  }
  if (i && p(n), f !== null) {
    if (!f) {
      if (t.Ne) return t.be;
      throw C.initTransition(le(t)), new e(w);
    }
    t.Ne = !1;
  }
  return o;
}
function qt(e, t = !1) {
  e.o?.le && It(e),
    e.o?.fe && e.o !== null && (e.o.fe = !1),
    e.o !== null && (e.o.De = !1),
    e.S = t ? 0 : e.S & 4,
    e.o?._ && Rt(e),
    (e.o?.ye || e.o?.Ce) && S.de(e),
    e.o?.i && e.T & 2048 && S.me !== null && S.me(e);
  let n = un(e);
  n && n.call(e);
}
function Jt(n, r, i, a, o) {
  r === 2 && !(i instanceof t) && !(i instanceof e) && (i = new t(n, i));
  let s = r === 1 && i instanceof e ? i.source : void 0,
    c = s === n,
    l = r === 1 && n.o?.Pe !== void 0 && !c,
    u = l && ue(n);
  a ||
  (r === 1 && s
    ? (Pt(n, s), n.S = 1 | n.S & 4, Rt(n, s, i))
    : (It(n), n.S = r | (r === 2 ? 0 : n.S & 4), T(n)._ = i),
    S.de?.(n),
    n.o?.i && n.T & 2048 && S.me !== null && S.me(n)), o && !a && de(n, o);
  let d = a || u, f = a || l ? void 0 : o, p = un(n);
  if (p) {
    if (a && r === 1) return;
    d ? p.call(n, r, i) : p.call(n);
    return;
  }
  zt(n, (t, n) => {
    if (
      t.Te = y,
        r === 1 && s && !t.o?.le?.has(s) || r !== 1 && (t.o?._ !== i || t.o?.le)
    ) {
      if (n.ve && r !== 1 && !(i instanceof e)) {
        rt(t), x();
        return;
      }
      !d && !t.Ae && je(t), Jt(t, r, i, d, f);
    }
  });
}
S.Fe = rn, S.He = ht;
var Yt = !1;
function Xt(e) {
  en = e;
}
function Zt(e) {
  tn = e;
}
function Qt(e) {
  w = e;
}
var $t = !1, en = !1, tn = !1, w = null, nn = null;
function rn(t, n = !1) {
  Pe();
  let r = t.ge;
  if (!n) {
    if (
      t.Ae && (!r || b) && b !== t.Ae && C.initTransition(t.Ae),
        st(t, nt(t)),
        t.o !== null && (t.o.Ie = null, Gt(t)),
        t.Ae || r === 3
    ) ht(t);
    else if (t.xe !== null || t.Ge !== null) {
      pt(t);
      let e = T(t);
      e.qe = t.Ge, e.Ye = t.xe, t.Ge = null, t.xe = null, t.Ze = 0;
    }
  }
  let i = !!(t.ie & 128),
    a = !!(t.T & 128) && t.o?.Pe !== g && t.o?.Pe !== void 0,
    c = !!(t.S & 4),
    l = t.S & 2 ? t.o?._ : void 0,
    u = t.o?.le?.has(t),
    d = (t.ie & o) !== 0,
    f = t.Ne,
    p = w;
  w = t, t.je = null, t.Ke++, t.ie = 4, t.Te = y;
  let m = t.Re === g ? t.be : t.Re, h = t.Me, ee = !1, te = Yt, ne = nn;
  Yt = !0;
  let re = tn;
  if (tn = !1, i) {
    let e = S.Be(t, !0);
    e ? nn = e : e === !1 && (i = !1);
  } else if (b && !n && b.ze.length) {
    let e = S.Be(t, !1);
    e && (i = !0, nn = e);
  }
  let ie = r && r !== 2, ae = $t;
  ie && ($t = !0);
  try {
    if (t.T & 64) m = t.oe(m), t.o !== null && (t.o.Ie = null), t.Ne = !1;
    else {
      let e = t.o?.Ie,
        n = t.oe(m),
        r = typeof n == `object` && !!n,
        i = t.o?.Ie !== e;
      m = i || !r ? n : Kt(t, n),
        !i && !r && (t.o !== null && (t.o.Ie = null), t.Ne = !1);
    }
    (t.S !== 0 || t.o !== null) && qt(t, n), t.T & 1024 && t.o?.Je && S.Xe(t);
  } catch (n) {
    let r = n instanceof e;
    if (r && t.Ne) Lt(t, n);
    else {
      r && nn && S.$e(t);
      let e = !1;
      r && (T(t).fe = !0, S.et !== null && (e = S.et(t, d))),
        Jt(t, r ? 1 : 2, n, void 0, r ? t.o?.Je : void 0),
        r && u && !t.o?.Ie && Ut(t),
        e && S.k(t);
    }
  } finally {
    Yt = te,
      tn = re,
      ie && ($t = ae),
      ee = (t.ie & s) !== 0,
      t.ie = 0 | (n ? t.ie & 256 : 0),
      w = p;
  }
  if (!t.o?._) {
    Ot(t);
    let e = a ? v(t.o?.Pe) : t.Re === g ? t.be : t.Re, o = !1;
    try {
      o = !r && c || !t.pe || !t.pe(e, m);
    } catch (e) {
      Jt(t, 2, e);
    }
    if (
      r && o &&
      (t.tt = !t.o?._, n || t.C.enqueue(r, t.nt ??= S.it.bind(null, t))),
        !t.o?._
    ) {
      if (o) {
        let e = a ? t.o?.Pe : void 0;
        n || r && (b !== t.Ae || b === null || t.T & 32768) || i
          ? (t.be = m, a && i && (T(t).Pe = m === void 0 ? _ : m, t.Re = g))
          : (t.Re = m,
            f && (t.Ne = !0),
            (b || t.Ae) && S.Ue !== null && S.Ue(t, m)),
          t.u !== null && (!a || i || t.o?.Pe !== e) && Ie(t, i || a);
      } else if (a) {
        t.Re === g && je(t), t.Re = m, f && (t.Ne = !0), t.T & 16384 && S.he(t);
      } else if (t.Me != h) {
        for (let e = t.u; e !== null; e = e.ae) {
          ot(e.ce, nt(e.ce));
        }
      }
    }
    l !== void 0 && !o && !t.o?._ && Ht(t, l), u && !(t.S & 5) && Ut(t);
  }
  nn = ne,
    (t.Re !== g || t.o !== null && (t.o.Ye !== null || t.o.qe !== null) ||
      t.S & 5) && (!n || t.S & 1) && (!t.Ae || a) && je(t),
    t.Ae && r && b !== t.Ae && et(t.Ae, () => rn(t)),
    ee && (rt(t), x());
}
function an(e) {
  if (!(e.ie & 68)) {
    if (e.ie & 1) {
      for (let t = e.ut; t; t = t.lt) {
        let n = t.ot, r = n.st || n;
        if (r.oe && an(r), e.ie & 2) break;
      }
    }
    (e.ie & 130 || e.o?._ && e.Te < y && !e.o?.Ie) && rn(e), e.ie &= 280;
  }
}
function on(e, t) {
  let n = t?.transparent ?? !1,
    r = typeof t == `object` && !!t && `loadingValue` in t,
    i = {
      id: yt(t, n, w),
      T: (n ? 4 : 0) | !!t?.ownedWrite | (!w || t?.lazy ? 32 : 0) |
        (t?.sync ? 64 : 0) | (t?.H ? 2 : 0) | 0,
      pe: t?.equals ?? gn,
      Ge: null,
      C: w?.C ?? C,
      we: w?.we ?? ee,
      Ze: 0,
      oe: e,
      be: r ? t.loadingValue : void 0,
      Me: 0,
      rt: void 0,
      ct: null,
      ut: null,
      je: null,
      Ke: 0,
      u: null,
      _t: null,
      ke: w,
      Le: null,
      ft: null,
      xe: null,
      ie: t?.lazy ? 512 : 0,
      S: r ? 0 : 4,
      Te: y,
      Re: g,
      Ae: null,
      It: -1,
      Ne: r,
      o: null,
    };
  return t?.unobserved && (T(i).Et = t.unobserved), fn(i, t), i;
}
function T(e) {
  return e.o ??= {
    Pe: void 0,
    Nt: void 0,
    Je: void 0,
    ye: void 0,
    Ce: void 0,
    Tt: void 0,
    t: 0,
    Ie: null,
    Ee: null,
    _: void 0,
    fe: void 0,
    le: void 0,
    h: void 0,
    De: !1,
    i: null,
    Et: void 0,
    We: void 0,
    qe: null,
    Ye: null,
    St: void 0,
  };
}
function sn(e, t, n, r, i) {
  let a = i?.transparent ?? !1,
    o = {
      id: yt(i, a, w),
      T: (a ? 4 : 0) | !!i?.ownedWrite | (i?.sync ? 64 : 0) | (i?.dt ?? 0) | 0,
      pe: !1,
      Ge: null,
      C: w?.C ?? C,
      we: w?.we ?? ee,
      Ze: 0,
      oe: e,
      be: void 0,
      Me: 0,
      rt: void 0,
      ct: null,
      ut: null,
      je: null,
      Ke: 0,
      u: null,
      _t: null,
      ke: w,
      Le: null,
      ft: null,
      xe: null,
      ie: 512,
      S: 4,
      Te: y,
      Re: g,
      Ae: null,
      It: -1,
      Ne: !1,
      tt: !1,
      At: void 0,
      Ot: t,
      Ct: n,
      Rt: void 0,
      ge: r,
      o: null,
    };
  return i?.unobserved && (T(o).Et = i.unobserved), fn(o, dn), o;
}
var cn = null;
function ln(e) {
  cn = e;
}
function un(e) {
  let t = e.o?.h;
  return t === void 0 ? e.ge ? cn ?? void 0 : void 0 : t;
}
var dn = { lazy: !0 };
function fn(e, t) {
  e.ct = e;
  let n = w?.Gt ? w.Dt : w;
  if (w) {
    let t = w.xe;
    t === null ? w.xe = e : (e.Le = t, t.ft = e, w.xe = e);
  }
  n && (e.Me = n.Me + 1), S.Pt !== null && S.Pt(e), !t?.lazy && rn(e, !0);
}
function pn(e, t, n = null) {
  let r = {
    pe: t?.equals ?? gn,
    T: +!!t?.ownedWrite | (t?.H ? 2 : 0),
    be: e,
    u: null,
    _t: null,
    Te: y,
    st: n,
    Se: n?.o?.i || null,
    Re: g,
    Ae: null,
    It: -1,
    o: null,
  };
  return t?.unobserved && (T(r).Et = t.unobserved),
    n && (T(n).i = r, n.T |= u),
    r;
}
function mn(e, t) {
  let n = pn(e, t);
  return T(n).Pe = g, n.T |= 128, n;
}
function hn(e, t) {
  let n = on(e, t);
  return T(n).Pe = g, n.T |= 128, n;
}
function gn(e, t) {
  return e === t;
}
function _n(e, t) {
  if (S.ht === null && !Yt) return e();
  let n = Yt;
  Yt = !1;
  try {
    return S.ht === null ? e() : S.ht(e);
  } finally {
    Yt = n;
  }
}
function vn(e, t) {
  e.ie & 512
    ? (e.ie &= -513, rn(e, !0))
    : e.ie & 64
    ? e.T & 32 && rn(e, !0)
    : t && an(e);
}
var yn = Symbol(`read-slow`);
function bn(e) {
  if (
    tn || en || e.oe || e.st || e.o?.Pe !== void 0 || e.o?.We !== void 0 ||
    b !== null || nn !== null
  ) return yn;
  let t = w;
  return t?.Gt && (t = t.Dt),
    t && Yt && Nt(e, t),
    !t || e.Re === g || t.T & 16 ? e.be : e.Re;
}
function E(e) {
  if (tn) return S.gt(e);
  let t = w;
  t?.Gt && (t = t.Dt);
  let n = e, r = e.st, i = r || e;
  if (
    en ? S.Ht(e, t, i, r) : typeof n.oe == `function` && vn(e, !1),
      !n.oe && i === e && e.o?.Pe === void 0 && e.o?.We === void 0 &&
      b === null && nn === null
  ) return t && Yt && Nt(e, t), !t || e.Re === g || t.T & 16 ? e.be : e.Re;
  if (t && Yt && (Nt(e, t, en), i.oe)) {
    let n = nt(e);
    i.Me >= n.Qe ? (lt(t), ct(n), an(i)) : t.T & 65536 && an(i);
    let r = i.Me;
    r >= t.Me && e.ke !== t && (t.Me = r + 1);
  }
  if (i.S & 1) {
    if (t && !($t && i.Ae && b !== i.Ae)) {
      if (nn === null || S.Vt(i)) throw !Yt && e !== t && Nt(e, t), i.o?._;
    } else if (t && i.S & 4) {
      throw !Yt && e !== t && Nt(e, t), i.o?._;
    } else if (!t && i.S & 4) throw i.o?._;
  }
  if (i.oe && i.S & 2) {
    if (Yt && !en && i.Te < y) return rn(i), E(e);
    throw i.o?._;
  }
  if (e.o?.Pe !== void 0 && e.o?.Pe !== g) {
    if (!(t && t.T & 8192)) return v(e.o?.Pe);
    e.T |= f;
  }
  if (nn !== null && b !== null && t !== null && S.vt(e, i, t)) return e.be;
  let a = !t || nn !== null && S.bt(e, i, t) || e.Re === g || t.T & 16 ||
      $t && e.Ae && b !== e.Ae || e.T & 131072 && !tn && !(t.T & 8192)
    ? e.be
    : e.Re;
  return en && S.kt(e, a),
    !t && i === e && typeof n.oe == `function` && e.T & 32 && !(i.S & 1) &&
    !e.u && (jt.add(e), x()),
    a;
}
function D(e, t) {
  if (e.Ae && b !== e.Ae && C.initTransition(e.Ae), e.T & 128 && !be) {
    return S.xt(e, t);
  }
  let n = e.Re === g ? e.be : e.Re;
  if (
    typeof t == `function` && (t = t(n)), !(e.S & 4 || !e.pe || !e.pe(n, t))
  ) return t;
  let r = e.Re !== g;
  return r || je(e),
    e.Re = t,
    e.T & 256 && S.Ue !== null && S.Ue(e, t),
    e.oe !== void 0 && (e.Te = y),
    r && e.It === Ne && nn === null && !Me ? t : (Ie(e), x(), t);
}
function xn(e) {
  st(e, nt(e)),
    !(e.ie & 1024) && e.Re === g && (je(e), x()),
    e.ie = e.ie & -4 | a,
    e.Ut = y;
}
function Sn(e, t) {
  let n = D(e, t);
  return xn(e), n;
}
function Cn(e, t) {
  let n = w, r = Yt;
  w = e, Yt = !1;
  try {
    return t();
  } finally {
    w = n, Yt = r;
  }
}
function wn(e) {
  if (typeof e.oe == `function` && !(e.ie & 64)) {
    if (e.ie & 1024) {
      if (e.Ut === y) return;
      e.ie &= ~a;
    } else e.ie & 11 || (e.ie |= o, Fe());
    e.ie = e.ie & -2 | 2, at(e, nt(e)), x();
  }
}
function Tn(e, t = St()) {
  if (!t) throw new r();
  let n = Dn(e, t) ? t.we[e.id] : e.defaultValue;
  if (On(n)) throw new i();
  return n;
}
function En(e, t, n = St()) {
  if (!n) throw new r();
  n.we = { ...n.we, [e.id]: On(t) ? e.defaultValue : t };
}
function Dn(e, t) {
  return !On(t?.we[e.id]);
}
function On(e) {
  return e === void 0;
}
function kn(e, t) {
  let n = e.o?.Pe !== g, r = n ? v(e.o?.Pe) : e.be;
  if (
    typeof t == `function` && (t = t(r)),
      !(e.S & 4 || (e.ie ?? 0) & 3 || !e.pe || !e.pe(r, t))
  ) {
    if (n) {
      let t = le(e);
      t && b !== t && C.initTransition(t);
    }
    return t;
  }
  n ? C.initTransition(le(e)) : C.m.ze.push(e), T(e).Nt = b;
  let i = ie(e);
  return T(e).Je = i,
    e.T |= c,
    T(e).Pe = t === void 0 ? _ : t,
    (e.o?.ye !== void 0 || e.o?.Ce !== void 0) && S.Ue !== null && S.Ue(e, t),
    e.oe !== void 0 && (e.Te = y),
    Ie(e, !0),
    x(),
    t;
}
function An(t) {
  for (let n = 0; n < t.ze.length; n++) {
    let r = t.ze[n];
    if (ue(r) && `S` in r && r.S & 1 && r.o?._ instanceof e) return !0;
  }
  return !1;
}
function jn(e) {
  let t = e.length;
  for (let n = 0; n < t; n++) {
    let t = e[n];
    t.o !== null && (t.o.Je = void 0), t.S & 1 || (t.S &= -5);
    let r = t.o?.Pe;
    T(t).Pe = g,
      r !== g && t.be !== v(r) && Ie(t, !0),
      t.Ae = null,
      t.o !== null && (t.o.Nt = null);
  }
  for (let n = 0; n < t; n++) {
    let t = e[n];
    (t.o?.ye || t.o?.Ce) && S.un(t);
    let r = t.o?.Tt;
    r && (r.o?.ye === t || r.o?.Ce === t) && S.un(r);
  }
  e.splice(0, t);
}
function Mn(e, t) {
  for (let n = 0; n < e.length; n++) e[n](t);
}
function Nn(e) {
  for (let t of re) {
    if (t.rn || t.Oe.size > 0) continue;
    let n = t.tn[e - 1];
    n.length && (t.tn[e - 1] = [], Mn(n, e));
  }
  e === 1 && S.ln?.();
}
function Pn(e) {
  for (let t of re) {
    (e ? t.Ae === e : !t.Ae) &&
      (t.rn ||
        (t.tn[0].length && Mn(t.tn[0], 1), t.tn[1].length && Mn(t.tn[1], 2)),
        t.nn.o?.Je === t && t.nn.o !== null && (t.nn.o.Je = void 0),
        t.Oe.clear(),
        t.tn[0].length = 0,
        t.tn[1].length = 0,
        re.delete(t),
        ne.delete(t.nn));
  }
}
function Fn(e) {
  let t = e.o?.Je;
  return t ? oe(t) === oe(nn) && !ue(e) : !1;
}
function In(e, t, n) {
  return tn || e.Re === g || e.oe || t !== e && !(t.ie & 1024)
    ? !1
    : (b.cn.add(n), !0);
}
function Ln(e, t, n) {
  return e.o?.Pe !== void 0 || e.o?.Je || t.S & 1 ||
      t === e && $t && n.o?.Tt !== e
    ? (e.Re !== g && (b ?? C.m).cn.add(n), !0)
    : !1;
}
function Rn(e, t) {
  if (t) {
    let t = ce(e);
    return t
      ? !C.fn && !b && !t.Ae && t.nn.o?.Tt !== void 0 && e.o?.Pe === void 0
        ? (e.o !== null && (e.o.Je = void 0), !1)
        : t
      : null;
  }
  for (let t = e.ut; t; t = t.lt) {
    let n = t.ot;
    if (n.ie & 128) {
      let t = ce(n);
      if (t) return e.ie |= 128, de(e, t), t;
    }
  }
  return null;
}
function zn(e) {
  let t = oe(nn);
  t.nn !== e &&
    (t.Oe.add(e), T(e).Je = t, e.T |= c, S.de !== null && S.de(t.nn));
}
function Bn(e) {
  let t = ce(e);
  t && (t.Oe.delete(e), S.de !== null && S.de(t.nn));
}
function Vn(e) {
  C.m.En.add(e), x();
}
function Hn() {
  S.xt === null &&
    (S.xt = kn,
      S.Tn = jn,
      S.dn = An,
      S.In = Pn,
      S.Nn = Nn,
      S.vt = In,
      S.Vt = Fn,
      S.bt = Ln,
      S.Be = Rn,
      S.$e = zn,
      S.Xe = Bn,
      S._n = Vn);
}
Hn();
var Un = null, Wn = new Map();
function Gn(e) {
  let t = e.st;
  t && (t.T |= l, (T(t).St ??= new Set()).add(e));
}
function Kn(e) {
  let t = e.o?.ye;
  return t ||
    (t = mn(!1, { ownedWrite: !0 }),
      T(e).ye = t,
      e.T |= 256,
      Gn(e),
      T(t).Tt = e,
      $n(e) && D(t, !0)),
    t;
}
function qn(e) {
  if (!Un) return;
  Un.sources.add(e);
  let t = e.st || e;
  t !== e && Un.sources.add(t);
}
function Jn(e) {
  Un?.sources.add(e);
}
function Yn(e, t) {
  if (e.o?.t) return !0;
  if (e.S & 2 || t.has(e)) return !1;
  t.add(e);
  let n = e.st;
  if (n && Yn(n, t)) return !0;
  let r = e, i = r.ie & 4 ? r.je : void 0;
  if (i !== null) {
    for (let e = r.ut ?? null; e !== null; e = e.lt) {
      if (!e.ve && Yn(e.ot, t)) return !0;
      if (e === i) break;
    }
  }
  return !1;
}
function Xn(e) {
  return Ge !== 0 && Yn(e, new Set());
}
function Zn(e) {
  if (e.o?.le) {
    for (let t of e.o.le) if (!t.o?.De) return !1;
    return !0;
  }
  return e.o?.De ?? !1;
}
function Qn(e) {
  return !!(e.S & 1) && !(e.S & 4) && !Zn(e);
}
function $n(e) {
  let t = e;
  if (t.ie & 64) return !1;
  if (Xn(e)) return !0;
  let n = e.st;
  if (e.o?.Tt) {
    let t = e.o?.Tt;
    return Qn(t.st || t);
  }
  if (n && e.Re !== g && !ue(e)) {
    return !!(n.ie & 1024) || !n.o?.Ie && !(n.S & 1) || !!(n.S & 1) && Zn(n);
  }
  if (e.Re !== g && !(t.S & 4) && !t.Ne) {
    if (ue(e)) return !e.pe || !e.pe(e.Re, v(e.o?.Pe));
    if (!t.o?.De) return !0;
  }
  return Qn(t);
}
function er(e, t) {
  e.o?.ye && tr(e), e.o?.Ce && D(e.o?.Ce, t);
}
function tr(e) {
  e.o?.ye && D(e.o?.ye, $n(e)), e.o?.Ce && tr(e.o?.Ce);
}
function nr(e) {
  let t = e.o?.St;
  if (t !== void 0) { for (let e of t) tr(e); }
}
function rr(e, t = !1) {
  let n = t ? ar : tr,
    r = new Set(),
    i = (e) => {
      if (!r.has(e)) {
        r.add(e), (e.o?.ye || e.o?.Ce) && n(e);
        for (let t = e.u; t !== null; t = t.ae) i(t.ce);
        for (let t = e.o?.i ?? null; t !== null; t = t.Se) i(t);
      }
    };
  i(e);
}
function ir(e) {
  if (Wn.size === 0) return;
  let t = !1;
  for (let [n, r] of Wn) {
    let i = n.Ae, a = i ? $e(i) : null;
    if (!a) {
      Wn.delete(n);
      continue;
    }
    if (a !== e) continue;
    Wn.delete(n);
    let o = n.o?.ye?.o?.Je;
    for (let e of r) {
      e.ie & 64 ||
        (e.ie |= 128,
          o ? de(e, o) : e.o !== null && (e.o.Je = void 0),
          rt(e),
          t = !0);
    }
  }
  t && x();
}
function ar(e) {
  Wn.size !== 0 && Wn.delete(e);
  let t = e.o?.ye;
  if (t && (t.o?.Pe === void 0 || t.o?.Pe === g)) {
    let n = $n(e);
    (t.be !== n || t.Re !== g) && (t.be = n, t.Re = g, Ie(t), x());
  }
  let n = e.o?.Ce;
  n && !(n.ie & 64) &&
    ((n.o?.Pe === void 0 || n.o?.Pe === g) && n.Re === g &&
      !Object.is(n.be, e.be) && !(n.ie & 3) &&
      (n.ie |= 2, at(n, nt(n)), Ie(n), x()),
      ar(n));
}
function or(e) {
  let t = e.o?.Ce;
  if (t && t.ie & 64 && (t = void 0), !t) {
    let n = tn;
    Zt(!1);
    let r = en;
    Xt(!1);
    let i = w;
    Qt(null),
      t = hn(() => E(e)),
      T(e).Ce = t,
      e.T |= 256,
      Gn(e),
      T(t).Tt = e,
      e.Re !== g && !ue(e) && D(t, e.Re),
      Qt(i),
      Xt(r),
      Zt(n);
  }
  return t;
}
function sr(t) {
  let n = or(t), r = tn;
  Zt(!1);
  let i = t.o?.Pe !== void 0 && t.o?.Pe !== g ? v(t.o?.Pe) : t.be, a;
  try {
    let e = nt(n);
    if (n.Me >= e.Qe && !(n.ie & 96)) {
      ct(e);
      let t = en;
      Xt(!1);
      try {
        vn(n, !0);
      } finally {
        Xt(t);
      }
    }
    a = E(n);
  } catch (n) {
    if (n instanceof e && (!w || !(t.S & 4))) return i;
    throw n;
  } finally {
    Zt(r);
  }
  if (n.S & 1) return i;
  if ($t && nn && n.o?.Je) {
    let e = oe(n.o?.Je);
    if (e !== oe(nn) && e.Oe.size > 0) return i;
  }
  return n.Re !== g && !ue(n) && !($t && n.Ae && b !== n.Ae) ? n.Re : a;
}
function cr(e) {
  if (typeof e.oe != `function`) return !1;
  let t = e.o?.Tt;
  return t !== void 0 && !((t.st || t).S & 4);
}
function lr(e, t, n, r) {
  Xt(!1), typeof e.oe == `function` && vn(e, !0);
  let i = n.S;
  if (t && i & 1 && i & 4 && !cr(n)) {
    throw Yt && e !== t && Nt(e, t), Xt(!0), n.o?._;
  }
  qn(e), r && qn(r), Xt(!0);
}
function ur(e) {
  let t = e.Ae, n = t ? $e(t) : b;
  if (!n || n.sn) return !1;
  if (n.ue.length && !e.oe) return !0;
  if (!t) return !1;
  for (let [e, t] of n._e) {
    if (t.size && e.S & 1 && e.o?._?.source === e) return !0;
  }
  return !1;
}
function dr(e, t) {
  if (Un !== null && e.Re !== g && t === e.Re) {
    if (ur(e)) return;
    Un.freshReads.add(e);
  }
}
function fr(e, t) {
  let n = !!(e.S & 1),
    r = t && !(n && !e.o?.De),
    i = n && (e.o?.De ?? !1) !== r;
  return r ? T(e).De = !0 : e.o !== null && (e.o.De = !1), i;
}
function pr(e) {
  let t = tn;
  Zt(!0);
  try {
    return e();
  } finally {
    Zt(t);
  }
}
function mr(t) {
  let n = en, r = Un;
  Xt(!0);
  let i = Un = {
      found: !1,
      sources: new Set(),
      freshReads: new Set(),
      suppressed: [],
    },
    a = () => {
      Xt(!1);
      let e = tn;
      Zt(!1);
      try {
        i.sources.forEach((e) => {
          E(Kn(e)) &&
            (i.freshReads.has(e) ? i.suppressed.push(e) : i.found = !0);
        });
      } finally {
        Zt(e), Xt(!0);
      }
      if (
        !i.found && i.suppressed.length && w && typeof w.oe == `function`
      ) {
        for (let e of i.suppressed) {
          let t = Wn.get(e);
          t || Wn.set(e, t = new Set()), t.add(w);
        }
      }
    };
  try {
    return t(), a(), i.found;
  } catch (t) {
    if (a(), t instanceof e) {
      let e = !!(t.source?.S & 4);
      if (i.found && !e) return !0;
      if (w && e) throw t;
    }
    return i.found;
  } finally {
    Xt(n), Un = r;
  }
}
S.Ue = er,
  S.de = tr,
  S.me = nr,
  S.un = ar,
  S.gt = sr,
  S.Ht = lr,
  S.kt = dr,
  S.et = fr,
  S.k = rr,
  S.Wt = Jn,
  S.zt = ir;
function hr(e, t, n, r) {
  let i = sn(e, t, n, r?.user ? 2 : 1, r);
  rn(i, !0),
    !r?.defer &&
    (i.ge === 2 || r?.schedule ? i.C.enqueue(i.ge, _r.bind(null, i)) : _r(i));
}
function gr(e, t) {
  let r = e === void 0 ? this.S : e, i = t === void 0 ? this.o?._ : t;
  if (r & 2) {
    if (this.C.notify(this, 1, 0), this.ge === 2) {
      this.S & 2 &&
        (this.tt = !0,
          this.C.enqueue(this.ge, this.nt ??= _r.bind(null, this)));
      return;
    }
    if (!this.C.notify(this, 2, 2)) throw De(n(i)), i;
  } else this.ge === 1 && this.C.notify(this, 3, r, i);
}
function _r(e) {
  if (!e.tt || e.ie & 64) return;
  if (e.S & 2 && e.ge === 2) {
    let t = n(e.o?._);
    e.At = e.be, e.tt = !1;
    try {
      e.Ct
        ? e.Ct(t, () => {
          let t = e.Rt;
          e.Rt = void 0, t?.();
        })
        : console.error(t);
    } catch (t) {
      if (!e.C.notify(e, 2, 2)) throw De(t), t;
    }
    return;
  }
  let r = e.Rt;
  e.Rt = void 0;
  try {
    r?.(), e.Rt = e.Ot(e.be, e.At);
  } catch (n) {
    if (T(e)._ = new t(e, n), e.S |= 2, !e.C.notify(e, 2, 2)) throw De(n), n;
  } finally {
    e.At = e.be, e.tt = !1;
  }
}
S.it = _r, ln(gr);
function vr(e) {
  return Ct(e);
}
function yr(e) {
  let t = E.bind(null, e);
  return t[te] = e, t;
}
function br(e, t) {
  if (typeof e == `function`) {
    let n = on(e, t);
    return n.T &= -33, [yr(n), Sn.bind(null, n)];
  }
  let n = pn(e, t);
  return [yr(n), D.bind(null, n)];
}
function xr(e, t) {
  return yr(on(e, t));
}
function Sr(e, t, n) {
  hr(e, t.effect || t, t.error, { user: !0, ...n });
}
function Cr(e, t, n) {
  hr(e, t, void 0, n);
}
var wr = class extends Ae {
  enqueue(e, t) {
    queueMicrotask(() => t(e));
  }
};
function Tr(e) {
  let t = e?.[te];
  if (!t) return Promise.resolve(void 0);
  wn(t);
  let n = new Promise((n, r) => {
    queueMicrotask(() => {
      let i = null;
      hr(() => {
        if (i === null) {
          i = St();
          let e = new wr();
          e.ke = i.C, i.C = e;
        }
        return E(t);
      }, (t) => {
        n(typeof e == `function` ? t : e), mt(i);
      }, (e) => {
        r(e), mt(i);
      }, { user: !0, dt: p | d | m });
    });
  });
  return n.catch(() => {}), n;
}
function Er(e, t) {
  if (Hn(), typeof e == `function`) {
    let n = hn(e, t);
    return n.T &= -33, [yr(n), D.bind(null, n)];
  }
  let n = mn(e, t);
  return [yr(n), D.bind(null, n)];
}
var Dr = new WeakSet(), Or = new WeakMap(), kr = null;
function Ar(e) {
  kr = e;
}
function jr(e) {
  let t = e;
  for (; t && !t.d;) t.d = !0, t = t.u;
}
var Mr = Symbol(0),
  O = Symbol(0),
  Nr = Symbol(0),
  Pr = Symbol(0),
  Fr = new WeakSet(),
  Ir = !1;
function Lr(e) {
  return Ir && Fr.has(e);
}
function Rr(e) {
  if (k(e)) {
    if (e[O] !== void 0) return;
    Ir = !0, Fr.add(e);
  }
}
function zr(e) {
  if (Array.isArray(e)) { for (let t = 0, n = e.length; t < n; t++) Rr(e[t]); }
  else for (let t in e) Rr(e[t]);
}
var Br = Object.prototype, Vr = new WeakMap();
function k(e) {
  if (typeof e != `object` || !e || Object.isFrozen(e)) return !1;
  let t = Object.getPrototypeOf(e);
  if (t === Br || t === null || Array.isArray(e)) return !0;
  let n = Vr.get(t);
  return n === void 0 &&
    (n = Object.prototype.toString.call(e) === `[object Object]` &&
      (typeof Node > `u` || !(e instanceof Node)),
      Vr.set(t, n)),
    n;
}
var Hr = !1;
function Ur(e) {
  Hr = e;
}
function Wr() {
  return Hr;
}
function Gr(e, t, n) {
  for (let [r, i] of Kr) {
    r.o?.t && i.scope.has(t) && (i.key === void 0 || i.key === n) &&
      (S.M(e), i.inherited.push(e));
  }
}
var Kr = new Map();
function qr() {
  return Kr.size > 0;
}
function Jr(e, t) {
  let n = e.n?.[Pr];
  if (n?.o?.t && S.Wt(n), Kr.size) {
    let r = e.v;
    for (let [e, i] of Kr) {
      if (e !== n && e.o?.t && (i.key === void 0 || i.key === t)) {
        let t = r;
        for (;;) {
          if (i.scope.has(t)) {
            S.Wt(e);
            break;
          }
          let n = t?.[O];
          if (n === void 0) break;
          let r = n.pb ?? n.v;
          if (r === t) break;
          t = r;
        }
      }
    }
  }
}
var Yr = null, Xr = null;
function Zr() {
  this.v = void 0,
    this.ch = void 0,
    this.pb = void 0,
    this.n = void 0,
    this.h = void 0,
    this.k = void 0,
    this.dk = void 0,
    this.u = void 0,
    this.pk = void 0,
    this.px = void 0,
    this.d = void 0,
    this.a = void 0,
    this.sc = void 0,
    this.nc = void 0,
    this.adopted = void 0,
    this.fam = void 0,
    this.s = void 0,
    this.ovl = void 0,
    this.del = void 0,
    this.pc = void 0,
    this.hv = void 0,
    this.ht = void 0;
}
Zr.prototype = Object.prototype;
function Qr(e) {
  return e.pc ??= { sp: null, p: null, ro: null, wk: null, qa: null, qe: null };
}
function $r(e, t, n, r = t?.fam ?? null) {
  let i = Array.isArray(e) ? [] : new Zr();
  return i.v = e,
    i.ch = e[O] !== void 0,
    i.pb = null,
    i.n = null,
    i.h = null,
    i.k = null,
    i.dk = null,
    i.pc = null,
    i.u = t,
    i.pk = n,
    i.px = null,
    i.d = !1,
    i.a = !1,
    i.sc = !1,
    i.nc = 0,
    i.adopted = !1,
    i.fam = r,
    i.s = !1,
    i.ovl = !1,
    i.del = null,
    i.hv = null,
    i.ht = null,
    i.px = new Proxy(i, aa),
    i[Nr] = i.px,
    (r?.map ?? Or).set(e, i),
    i;
}
function ei(e, t = null, n = null, r = t?.fam ?? null) {
  if (Ir && Lr(e)) return e;
  let i = (r?.map ?? Or).get(e);
  if (i !== void 0) return i.px;
  let a = e[O];
  return a !== void 0 && a.px === e && (r === null || a.fam === r)
    ? e
    : $r(e, t, n, r).px;
}
function A(e) {
  if (typeof e != `object` || !e) return e;
  let t = e[O];
  return t !== void 0 && t.px === e && t.v !== void 0
    ? (t.ovl && ui(t), t.pb ?? t.v)
    : e;
}
function ti(e, t, n) {
  let r = e.n ??= Object.create(null), i = r[t];
  if (i === void 0) {
    let a = i = pn(n, {
      equals: (t, n) => gn(t, n) || ni(e, t, n),
      unobserved() {
        a.o?.t || e.n && e.n[t] === a && (delete e.n[t], e.nc--);
      },
    }, e.fam?.node ?? void 0);
    a.T |= 1,
      a.acc = Xi(e.pb ?? e.v, t),
      a.px = void 0,
      a.pxv = void 0,
      e.fam?.opt && (T(a).Pe = g, a.T |= 128),
      t !== Pr && qr() && Gr(a, e.v, t),
      r[t] = i,
      e.nc++,
      jr(e);
  }
  return i;
}
function ni(e, t, n) {
  if (typeof t != `object` || !t || typeof n != `object` || !n) return !1;
  let r = e.fam?.map ?? Or, i = r.get(t);
  return i !== void 0 && i === r.get(n);
}
function ri(e, t, n) {
  let r = e.h ??= Object.create(null), i = r[t];
  if (i === void 0) {
    let a = i = pn(n, {
      equals: gn,
      unobserved() {
        a.o?.t || e.h && e.h[t] === a && delete e.h[t];
      },
    }, e.fam?.node ?? void 0);
    a.T |= 1,
      e.fam?.opt && (T(a).Pe = g, a.T |= 128),
      qr() && Gr(a, e.v, t),
      r[t] = i,
      jr(e);
  }
  return i;
}
function ii(e) {
  let t = e.k;
  if (t === null) {
    let n = t = pn(0, {
      equals: !1,
      unobserved() {
        e.k === n && (e.k = null);
      },
    }, e.fam?.node ?? void 0);
    n.T |= 1, e.fam?.opt && (T(n).Pe = g, n.T |= 128), e.k = t, jr(e);
  }
  return t;
}
function ai(e) {
  e.dk !== null && D(e.dk, 1);
}
var oi = new Map(), si = !1;
function ci(e, t) {
  let n = Object.getOwnPropertyDescriptors(e);
  for (let r of Reflect.ownKeys(n)) {
    let i = n[r];
    r === `length` && Array.isArray(e) ||
      (i.configurable = !0,
        !i.get && !i.set ? i.writable = !0 : t && (t.a = !0));
  }
  return Array.isArray(e)
    ? Object.defineProperties([], n)
    : Object.create(Object.getPrototypeOf(e), n);
}
function li(e) {
  let t = e.v;
  for (let n of Reflect.ownKeys(t)) {
    if (Ji.call(t, n) !== void 0 || Yi.call(t, n) !== void 0) {
      e.a = !0;
      break;
    }
  }
  return e.sc = !0, !e.a;
}
function ui(e) {
  if (!e.ovl) return;
  let t = e.pb, n = ci(e.v, e);
  for (let e of Reflect.ownKeys(t)) {
    let r = Object.getOwnPropertyDescriptor(t, e);
    r.get || r.set || !r.enumerable || !r.writable || !r.configurable
      ? Object.defineProperty(n, e, r)
      : n[e] = r.value;
  }
  if (e.del !== null) {
    for (let t of e.del) delete n[t];
    e.del = null;
  }
  let r = e.fam?.map ?? Or;
  r.delete(t), Dr.add(n), r.set(n, e), e.pb = n, e.ovl = !1;
}
function di(e) {
  let t = e.pb;
  if (
    t !== null && !xi.has(t) && e.fam?.opt === !0 && !be && !Wr() &&
    yi.has(e) && (bi.set(e, t), t = e.pb = null),
      b !== null && yi.set(e, b),
      t === null
  ) {
    if (
      e.fam === null && !Array.isArray(e.v) && (e.sc ? !e.a : li(e))
        ? (t = e.pb = Object.create(e.v), e.ovl = !0)
        : t = e.pb = ci(e.v, e), e.fam?.opt && !be && !Wr()
    ) {
      xi.add(t);
      let n = e.n;
      if (n !== null) {
        for (let e of Reflect.ownKeys(n)) {
          let r = n[e];
          Qi(r) && (t[e] = v(r.o?.Pe));
        }
      }
      let r = e.h;
      if (r !== null) {
        for (let e of Reflect.ownKeys(r)) {
          let n = r[e];
          Qi(n) && !v(n.o?.Pe) && delete t[e];
        }
      }
    }
    Dr.add(t), (e.fam?.map ?? Or).set(t, e), vi(e);
  }
  return t;
}
var fi = Symbol(`plainHold`), pi = !1;
function mi(e) {
  let t = e.ht;
  return t === null
    ? null
    : t !== fi && $e(t)?.sn === !0
    ? e.ht = e.hv = null
    : e.hv;
}
function hi(e, t, n = !1) {
  n ||
  (vi(e),
    e.adopted = !0,
    e.fam?.opt !== !0 && (Wr() ? e.ht = e.hv = null : (b !== null || pi) &&
      (mi(e) === null && (e.hv = e.v), e.ht = b ?? fi))),
    e.pb = null,
    e.ovl = !1,
    e.del = null,
    e.sc = !1,
    e.a = !1,
    e.pc !== null && (e.pc.wk = null),
    e.v = t,
    e.ch = t[O] !== void 0,
    (e.fam?.map ?? Or).set(t, e);
}
var gi = new Set(),
  _i = (e) => {
    let t = Object.getPrototypeOf(e);
    return t === Object.prototype || t === Array.prototype || t === null;
  };
function vi(e) {
  oi.has(e) || (si || (si = !0, ze(Ci)), x(), oi.set(e, e.v));
}
var yi = new WeakMap(), bi = new WeakMap(), xi = new WeakSet();
function Si(e) {
  if (Dr.has(e.v)) return;
  let t = ci(e.v, e);
  Dr.add(t),
    Or.set(t, e),
    e.v = t,
    e.ch = !1,
    e.u && (Si(e.u), e.u.v, e.u.v[e.pk] = e.v);
}
function Ci() {
  if (oi.size === 0) return;
  let e = [...oi];
  oi.clear();
  for (let [t, n] of e) {
    t.ht === fi && (t.ht = t.hv = null);
    let e = t.pb === null;
    if (t.pb !== null) {
      let e = yi.get(t);
      if (e !== void 0) {
        if ($e(e).sn === !1) {
          oi.set(t, n);
          continue;
        }
        yi.delete(t);
      }
      let r = !1, i = t.pb, a = t.n;
      if (a !== null) {
        let e = t.pc === null ? null : t.pc.wk,
          n = e === null || e === gi || t.a === !0 || !_i(t.ovl ? t.v : i)
            ? Reflect.ownKeys(a)
            : e;
        for (let e of n) {
          let t = a[e];
          if (t !== void 0 && t.Re !== g) {
            r = !0;
            break;
          }
        }
      }
      if (r) {
        oi.set(t, n);
        continue;
      }
      if (t.ovl) {
        Si(t);
        let e = t.v;
        for (let t of Reflect.ownKeys(i)) {
          let n = Object.getOwnPropertyDescriptor(i, t);
          n.get || n.set || !n.enumerable || !n.writable || !n.configurable
            ? Object.defineProperty(e, t, n)
            : e[t] = n.value;
        }
        if (t.del !== null) {
          for (let n of t.del) delete e[n];
          t.del = null;
        }
        (t.fam?.map ?? Or).delete(i),
          t.pb = null,
          t.ovl = !1,
          t.pc !== null && (t.pc.wk = null);
      } else {t.pc !== null && t.pc.ro !== null && !t.adopted &&
          t.fam?.opt !== !0 && Array.isArray(i) && Array.isArray(t.v) &&
          Xr.emitSetterRowOps(t, t.v, i),
          t.v = i,
          t.ch = !1,
          t.pb = null,
          t.pc !== null && (t.pc.wk = null);}
    }
    if (t.v === n) {
      t.adopted = !1;
      continue;
    }
    t.pc !== null && (t.fam !== null || t.adopted) &&
    (t.pc.ro !== null && t.fam?.opt !== !0 &&
      (t.fam === null ? t.adopted : e && !t.adopted) && Array.isArray(t.v) &&
      Array.isArray(n) && Xr.emitSetterRowOps(t, n, t.v),
      t.pc.p !== null && Yr.emitPatchLocal(t, t.v, n)),
      t.u && t.u.v[t.pk] === n && (Si(t.u), t.u.v, t.u.v[t.pk] = t.v),
      t.adopted && (t.adopted = !1, Ni(t, n, t.v));
  }
}
function wi(e) {
  let t = e.pb;
  if (t === null) return;
  if (e.fam?.opt) {
    if (!be && !Wr()) {
      kr.notifyOptimisticWrites(e, t);
      return;
    }
    if (!be) {
      we(!0);
      try {
        wi(e);
      } finally {
        we(!1);
      }
      return;
    }
  }
  let n = e.v,
    r = e.n,
    i = e.pc === null ? null : e.pc.wk,
    a = i === gi || e.a === !0 || !_i(e.ovl ? e.v : t) ? null : i;
  if (r !== null) {
    let i = a ?? Reflect.ownKeys(r);
    for (let a of i) {
      let i = r[a];
      if (i === void 0) continue;
      if (i.acc === !0 || qi.call(t, a) && Ji.call(t, a) !== void 0) {
        i.acc = Xi(t, a);
        let e = Object.getOwnPropertyDescriptor(n, a),
          r = Object.getOwnPropertyDescriptor(t, a);
        if (e && (e.get || e.set) || r && (r.get || r.set)) {
          (e?.get !== r?.get || e?.set !== r?.set || e?.value !== r?.value) &&
            D(i, () => Ti);
          continue;
        }
        gn(e?.value, r?.value) || D(i, () => r?.value);
        continue;
      }
      let o = e.del !== null && e.del.has(a) ? void 0 : t[a];
      D(i, () => o);
    }
  }
  let o = e.h;
  if (o !== null) {
    let n = a ?? Reflect.ownKeys(o);
    for (let r of n) {
      let n = o[r];
      n !== void 0 && D(n, r in t && !(e.del !== null && e.del.has(r)));
    }
  }
  if (e.dk !== null) {
    if (e.del !== null && e.del.size !== 0) ai(e);
    else {for (let r of a ?? Reflect.ownKeys(t)) {
        let i = t[r], a = n[r];
        if (typeof i == `object` && i ? !Ei(a, i) : !gn(a, i)) {
          ai(e);
          break;
        }
      }}
  }
  if (e.k !== null) {
    let r;
    if (e.ovl) {
      if (r = e.del !== null && e.del.size !== 0, !r) {
        for (let e of Reflect.ownKeys(t)) {
          if (!qi.call(n, e)) {
            r = !0;
            break;
          }
        }
      }
    } else r = Array.isArray(t) && Array.isArray(n) ? Di(n, t) : Oi(n, t);
    r && D(e.k, (e) => e + 1);
  }
  if (
    e.fam === null && Yr !== null && Yr.hasPatches() && Yr.emitPatch(e, t, n),
      e.fam !== null && e.pb !== null && Wr() && b === null
  ) {
    e.ht !== null && (e.ht = e.hv = null);
    let n = e.v;
    e.pb = null,
      e.v = t,
      e.ch = !1,
      e.u && e.u.v[e.pk] === n && (Si(e.u), e.u.v, e.u.v[e.pk] = t);
  }
}
var Ti = Symbol();
function Ei(e, t) {
  if (typeof e != `object` || !e) return !1;
  let n = Or.get(e);
  return n !== void 0 && n === Or.get(t);
}
function Di(e, t) {
  if (e.length !== t.length) return !0;
  for (let n = 0; n < t.length; n++) {
    let r = e[n], i = t[n];
    if (!gn(r, i) && !Ei(r, i)) return !0;
  }
  return !1;
}
function Oi(e, t) {
  let n = Reflect.ownKeys(t);
  if (Reflect.ownKeys(e).length !== n.length) return !0;
  for (let t of n) if (!(t in e)) return !0;
  return !1;
}
function ki(e, t, n, r, i = !0) {
  if (e.acc === !0 || i && qi.call(r, t) && Ji.call(r, t) !== void 0) {
    e.acc = Xi(r, t);
    let i = Object.getOwnPropertyDescriptor(n, t),
      a = Object.getOwnPropertyDescriptor(r, t);
    if (i && (i.get || i.set) || a && (a.get || a.set)) {
      (i?.get !== a?.get || i?.set !== a?.set || i?.value !== a?.value) &&
        D(e, () => Ti);
      return;
    }
    let o = i?.value, s = a?.value;
    !gn(o, s) && !Ei(o, s) && D(e, typeof s == `function` ? () => s : s);
  } else {
    let i = n[t], a = r[t];
    !gn(i, a) && !Ei(i, a) && D(e, typeof a == `function` ? () => a : a);
  }
}
function Ai(e) {
  return e.acc === !0;
}
function ji(e, t, n, r, i, a) {
  if (e.acc === !0) {
    ki(e, t, i, a, !1);
    return;
  }
  !gn(n, r) && !Ei(n, r) && D(e, typeof r == `function` ? () => r : r);
}
function Mi(e, t, n) {
  let r = e.h;
  if (r !== null) { for (let e of Reflect.ownKeys(r)) D(r[e], e in n); }
  e.k !== null &&
    (Array.isArray(n) && Array.isArray(t) ? Di(t, n) : Oi(t, n)) &&
    D(e.k, (e) => e + 1);
}
function Ni(e, t, n) {
  if (e.dk !== null && t !== n && ai(e), e.fam?.opt && !be) {
    we(!0);
    try {
      Ni(e, t, n);
    } finally {
      we(!1);
    }
    return;
  }
  let r = e.n;
  if (r !== null) { for (let e of Reflect.ownKeys(r)) ki(r[e], e, t, n); }
  let i = e.h;
  if (i !== null) { for (let e of Reflect.ownKeys(i)) D(i[e], e in n); }
  e.k !== null &&
    (Array.isArray(n) && Array.isArray(t) ? Di(t, n) : Oi(t, n)) &&
    D(e.k, (e) => e + 1);
}
var Pi = 0, Fi = null;
function Ii(e) {
  if (e.fam !== null) return e.fam;
  let t = e;
  for (; t.u !== null;) t = t.u;
  return t;
}
function j(e) {
  return Fi !== null && Fi.has(Ii(e));
}
function Li(e, t, n) {
  return typeof n == `object` && n && n[O] !== void 0 ? Ri(e, ei(n, e, t)) : n;
}
function Ri(e, t) {
  if (Fi !== null && j(e)) {
    let e = t?.[O];
    e !== void 0 && e.v !== void 0 && Fi.add(Ii(e));
  }
  return t;
}
var zi = new Set(), Bi = new Set([`__proto__`, `prototype`, `constructor`]);
function Vi() {
  let e = St();
  if (e === null) return !1;
  let t = e.Gt ? e.Dt : e;
  return t != null && !(t.T & 16);
}
function Hi() {
  let e = St();
  if (e === null) return !1;
  let t = e.Gt ? e.Dt : e;
  return t != null && !!(t.T & 16);
}
function Ui(e) {
  let t = e.n;
  if (t === null) return !1;
  for (let e of Reflect.ownKeys(t)) {
    let n = t[e];
    if (n.Re !== g && n.Ae != null && n.Ae.sn !== !0) return !0;
  }
  return !1;
}
function Wi(e) {
  if (e.ht !== null && !tn && !j(e) && !Wr() && !Vi()) {
    let t = mi(e);
    if (t !== null) return t;
  }
  return Gi(e, !1) ? e.pb : e.v;
}
function Gi(e, t) {
  return e.pb !== null &&
    (j(e) || Wr() || (t || Vi()) && !Ki(e) ||
      e.fam !== null && !Ki(e) && !Ui(e) && !Hi());
}
function Ki(e) {
  if (e.fam?.opt !== !0 || tn || ea()) return !1;
  let t = yi.get(e);
  return t !== void 0 && kr.retainsOptimism(t);
}
var qi = Object.prototype.hasOwnProperty,
  Ji = Object.prototype.__lookupGetter__,
  Yi = Object.prototype.__lookupSetter__;
function Xi(e, t) {
  return qi.call(e, t) &&
    (Ji.call(e, t) !== void 0 || Yi.call(e, t) !== void 0);
}
function Zi(e) {
  let t = be;
  we(!0);
  try {
    return e();
  } finally {
    we(t);
  }
}
function Qi(e) {
  return e.o?.Pe !== void 0 && e.o?.Pe !== g;
}
function $i() {
  let e = w;
  return e !== null && !!(e.T & 8192);
}
function ea() {
  return be || Wr() || $i();
}
function ta(e, t) {
  let n = !ea() && Qi(e)
    ? v(e.o?.Pe)
    : e.Re !== g && (tn || (Vi() || ea()) && !(e.T & 131072 && !ea()))
    ? e.Re
    : t;
  return n === Ti ? t : n;
}
function na(e, t, n, r, i) {
  let a = e.ch && r === e.v, o = n;
  if (t === `length` && e.fam?.opt === !0 && !a && Array.isArray(r)) {
    if (!j(e)) {
      let r = e.n?.length;
      r === void 0 ? xt() !== null && E(ti(e, t, n)) : xt() !== null && E(r);
    }
    return (ea() ? r : kr.optimisticView(e, r)).length;
  }
  if (j(e)) {
    if (e.fam?.opt && e.pb === null && !ea()) {
      let n = e.n?.[t];
      n !== void 0 && Qi(n) && (o = v(n.o?.Pe));
    }
  } else if (i !== void 0) {
    if (xt() !== null) {
      let e = bn(i);
      e === yn && (e = E(i)), (!a || Qi(i)) && (o = e === Ti ? n : e);
    } else (!a || Qi(i)) && (o = ta(i, n));
  } else xt() !== null && E(ti(e, t, n));
  if (e.s) return Li(e, t, o);
  if (i !== void 0) {
    if (i.pxv === o && o !== void 0) return Ri(e, i.px);
    if (!k(o)) return o;
    let n = ei(o, e, t);
    return i.px = n, i.pxv = o, Ri(e, n);
  }
  return k(o) ? Ri(e, ei(o, e, t)) : o;
}
function ra(e) {
  if (be || Wr()) return;
  let t = e.fam?.node;
  t != null && t.S & 6 && E(t);
}
function ia(e) {
  let t = e.fam.node;
  if (t == null) return;
  let n = tn;
  Zt(!1);
  let r = pi;
  pi = !0;
  try {
    vn(t, !0);
  } finally {
    pi = r, Zt(n);
  }
}
var aa = {
  get(e, t, n) {
    if (typeof t != `string`) {
      if (t === O) return e;
      if (t === Nr) return n;
      if (t === te) return e.fam?.node ?? void 0;
      if (t === Mr) {
        if (
          en && Jr(e, t),
            e.fam !== null && xt() === null && !j(e) && ra(e),
            !j(e) && xt() !== null
        ) {
          E(ii(e));
          let t = Wi(e);
          t[O] !== void 0 && t[Mr];
        }
        return;
      }
    }
    en && Jr(e, t),
      e.fam !== null && xt() === null && !j(e) && ra(e),
      e.fam !== null && tn && !j(e) && !Wr() && ia(e);
    let r = Wi(e);
    if (e.del !== null && r === e.pb && e.del.has(t)) {
      !j(e) && xt() !== null && E(ti(e, t, void 0));
      return;
    }
    if (e.ch === !1 && Fi === null) {
      let n = e.n?.[t];
      if (n !== void 0 && n.acc !== !0 && xt() !== null) {
        let r = bn(n);
        if (r === yn && (r = E(n)), typeof r != `object` || !r) return r;
        if (e.s) return Li(e, t, r);
        if (n.pxv === r) return n.px;
        if (k(r)) {
          let i = ei(r, e, t);
          return n.px = i, n.pxv = r, i;
        }
        return r;
      }
    }
    let i = e.n?.[t];
    if (i === void 0 ? !j(e) && xt() !== null && Xi(r, t) : i.acc === !0) {
      !j(e) && xt() !== null && E(i ?? ti(e, t, void 0));
      let a = Reflect.get(r, t, n);
      return e.s ? Li(e, t, a) : k(a) ? Ri(e, ei(a, e, t)) : a;
    }
    let a = e.ovl && r === e.pb;
    if (
      (t === `constructor` || t === `__proto__` || t === `prototype`) &&
      !qi.call(r, t) && !(a && qi.call(e.v, t))
    ) return;
    let o = r[t];
    if (o === void 0 && !qi.call(r, t) && !(a && qi.call(e.v, t))) {
      if (o = Reflect.get(r, t, n), typeof o == `function`) return o;
      if (o === void 0 && !j(e)) {
        xt() !== null && E(ti(e, t, void 0));
        let n = e.n?.[t];
        if (n) {
          let r = ta(n, void 0);
          return e.s ? Li(e, t, r) : k(r) ? Ri(e, ei(r, e, t)) : r;
        }
      } else if (o === void 0 && j(e) && e.fam?.opt && e.pb === null && !ea()) {
        let n = e.n?.[t];
        n !== void 0 && Qi(n) && (o = v(n.o?.Pe));
      }
      return e.s ? Li(e, t, o) : k(o) ? Ri(e, ei(o, e, t)) : o;
    }
    return typeof o == `function` && !qi.call(r, t) && !(a && qi.call(e.v, t))
      ? o
      : na(e, t, o, r, i);
  },
  has(e, t) {
    if (t === O || t === Nr || t === Mr) return !0;
    en && Jr(e, t), e.fam !== null && xt() === null && !j(e) && ra(e);
    let n = Wi(e), r = t in n;
    if (
      r && e.del !== null && n === e.pb && e.del.has(t) && (r = !1), !j(e)
    ) {
      if (xt() !== null) {
        let n = ri(e, t, r), i = E(n);
        Qi(n) && (r = !!i);
      } else if (!ea()) {
        let n = e.h?.[t];
        n !== void 0 && Qi(n) && (r = !!v(n.o?.Pe));
      }
    } else if (e.fam?.opt && e.pb === null && !ea()) {
      let n = e.h?.[t];
      n !== void 0 && Qi(n) && (r = !!v(n.o?.Pe));
    }
    return r;
  },
  ownKeys(e) {
    en && Jr(e),
      e.fam !== null && xt() === null && !j(e) && ra(e),
      !j(e) && xt() !== null && E(ii(e));
    let t = Wi(e), n;
    if (e.ovl && t === e.pb) {
      n = Reflect.ownKeys(e.v);
      let r = e.del;
      r !== null && r.size !== 0 && (n = n.filter((e) => !r.has(e)));
      for (let r of Reflect.ownKeys(t)) qi.call(e.v, r) || n.push(r);
    } else n = Reflect.ownKeys(t);
    if (!ea() && e.fam?.opt && e.h !== null && (!j(e) || e.pb === null)) {
      let t = null;
      for (let r of Reflect.ownKeys(e.h)) {
        let i = e.h[r];
        Qi(i) && (t ??= new Set(n), v(i.o?.Pe) ? t.add(r) : t.delete(r));
      }
      if (t !== null) return [...t];
    }
    return n;
  },
  getOwnPropertyDescriptor(e, t) {
    let n = Wi(e), r = Object.getOwnPropertyDescriptor(n, t);
    if (e.ovl && n === e.pb) {
      if (e.del !== null && e.del.has(t)) return;
      r === void 0 && (r = Object.getOwnPropertyDescriptor(e.v, t));
    }
    if (!ea() && e.fam?.opt && !j(e)) {
      let n = e.h?.[t];
      if (n !== void 0 && Qi(n)) {
        if (!v(n.o?.Pe)) return;
        if (r === void 0) {
          let n = e.n?.[t];
          return {
            value: n === void 0 ? void 0 : ta(n, void 0),
            writable: !0,
            enumerable: !0,
            configurable: !0,
          };
        }
      }
    }
    if (r !== void 0) {
      return t === `length` && Array.isArray(e) || (r.configurable = !0), r;
    }
  },
  set(e, t, n) {
    let r = j(e), i = !r && Wr();
    if (!r && !i || t === `__proto__`) return !0;
    let a = e.s ? n : A(n), o = di(e);
    zi.add(e);
    let s = Qr(e);
    if (Array.isArray(o)) {
      if (t === `length`) s.wk = gi;
      else if (s.wk !== gi) {
        let e = s.wk ??= new Set();
        e.add(t), e.add(`length`);
      }
    } else s.wk !== gi && (s.wk ??= new Set()).add(t);
    return Bi.has(t)
      ? (Object.defineProperty(o, t, {
        value: a,
        writable: !0,
        enumerable: !0,
        configurable: !0,
      }),
        e.del !== null && e.del.delete(t),
        !0)
      : (e.ovl && !qi.call(o, t)
        ? Object.defineProperty(o, t, {
          value: a,
          writable: !0,
          enumerable: !0,
          configurable: !0,
        })
        : o[t] = a,
        e.del !== null && e.del.delete(t),
        e.s && typeof a == `object` && a && Rr(a),
        i && wi(e),
        !0);
  },
  defineProperty(e, t, n) {
    let r = j(e), i = !r && Wr();
    if (!r && !i || t === `__proto__`) return !0;
    (n.get || n.set) &&
    (e.a = !0, e.pc !== null && e.pc.p !== null && Yr.demoteToEffects(e)),
      `value` in n && (n = { ...n, value: A(n.value) });
    let a = di(e);
    zi.add(e);
    let o = Qr(e);
    return o.wk !== gi && (o.wk ??= new Set()).add(t),
      Object.defineProperty(a, t, n),
      e.del !== null && e.del.delete(t),
      i && wi(e),
      !0;
  },
  deleteProperty(e, t) {
    let n = j(e), r = !n && Wr();
    if (!n && !r) return !0;
    let i = di(e);
    zi.add(e);
    let a = Qr(e);
    return a.wk !== gi && (a.wk ??= new Set()).add(t),
      delete i[t],
      e.ovl && qi.call(e.v, t) && (e.del ??= new Set()).add(t),
      r && wi(e),
      !0;
  },
};
function oa(e, t, n = !0) {
  let r = e[O], i = Fi;
  Fi = new Set(), Fi.add(Ii(r)), Pi++;
  let a;
  try {
    a = t(e);
  } finally {
    if (Pi--, Fi = i, Pi === 0 && zi.size) {
      let e = [...zi];
      zi.clear();
      for (let t of e) wi(t);
    }
  }
  a !== void 0 && a !== e && k(a) &&
    (r.fam?.opt && !be && !Wr()
      ? kr.notifyOptimisticWrites(r, A(a))
      : hi(r, A(a)));
}
function sa(e, t = !1) {
  let n = ei(e);
  return t && (n[O].s = !0, zr(e)), [n, (e) => oa(n, e)];
}
function ca(e, t, n) {
  let r = typeof n?.keyed == `function` ? n.keyed : void 0,
    i = t.length > 1,
    a = t,
    o = {
      Kt: Tt(),
      $t: 0,
      Jt: e,
      Xt: [],
      Yt: a,
      Zt: [],
      ts: [],
      ss: r,
      es: r || n?.keyed === !1 ? [] : void 0,
      rs: i && n?.keyed !== !1 ? [] : void 0,
      ns: n?.keyed === !1,
      hs: n?.fallback,
    },
    s = on(ua.bind(o));
  return o.Kt.Dt = s, s.T &= -33, yr(s);
}
var la = { ownedWrite: !0 };
function ua() {
  let e = this.Jt() || [], t = e.length;
  return e[Mr],
    Cn(this.Kt, () => {
      let n,
        r,
        i,
        a,
        o = this.es
          ? this.ns
            ? () => (i[r] = pn(e[r], la), this.Yt(yr(i[r]), r))
            : () => (i[r] = pn(e[r], la),
              a && (a[r] = pn(r, la)),
              this.Yt(yr(i[r]), a ? yr(a[r]) : void 0))
          : this.rs
          ? () => {
            let t = e[r];
            return a[r] = pn(r, la), this.Yt(t, yr(a[r]));
          }
          : () => {
            let t = e[r];
            return this.Yt(t);
          };
      if (t === 0) {
        this.$t !== 0 &&
        (this.Kt.dispose(!1),
          this.ts = [],
          this.Xt = [],
          this.Zt = [],
          this.$t = 0,
          this.es &&= [],
          this.rs &&= []),
          this.hs && !this.Zt[0] &&
          (this.ts[0]?.dispose(), this.Zt[0] = Cn(this.ts[0] = Tt(), this.hs));
      } else if (this.$t === 0) {
        let s = Array(t), c = Array(t);
        i = this.es && Array(t), a = this.rs && Array(t);
        try {
          for (r = 0; r < t; r++) s[r] = Cn(c[r] = Tt(), o);
        } catch (e) {
          for (n = 0; n <= r; n++) c[n]?.dispose();
          throw e;
        }
        this.ts[0] && this.ts[0].dispose(),
          this.Zt = s,
          this.ts = c,
          i && (this.es = i),
          a && (this.rs = a),
          this.Xt = e.slice(0),
          this.$t = t;
      } else {
        let s, c, l, u, d, f, p, m, h;
        for (
          s = 0, c = Math.min(this.$t, t);
          s < c &&
          (this.Xt[s] === e[s] || this.es && da(this.ss, this.Xt[s], e[s]));
          s++
        ) this.es && D(this.es[s], e[s]);
        for (
          c = this.$t - 1, l = t - 1;
          c >= s && l >= s &&
          (this.Xt[c] === e[l] || this.es && da(this.ss, this.Xt[c], e[l]));
          c--, l--
        );
        if (s === t && this.$t === t) {
          this.Xt = e.slice(0);
          return;
        }
        let g = t - this.$t, _ = Array(t), v = Array(t);
        for (
          i = this.es ? Array(t) : void 0,
            a = this.rs ? Array(t) : void 0,
            f = new Map(),
            p = Array(l + 1),
            r = l;
          r >= s;
          r--
        ) {
          u = e[r],
            d = this.ss ? this.ss(u) : u,
            n = f.get(d),
            p[r] = n === void 0 ? -1 : n,
            f.set(d, r);
        }
        for (n = s; n <= c; n++) {
          u = this.Xt[n],
            d = this.ss ? this.ss(u) : u,
            r = f.get(d),
            r !== void 0 && r !== -1
              ? (_[r] = this.Zt[n],
                v[r] = this.ts[n],
                i && (i[r] = this.es[n]),
                a && (a[r] = this.rs[n]),
                r = p[r],
                f.set(d, r))
              : (m ??= []).push(this.ts[n]);
        }
        try {
          for (r = s; r <= l; r++) {
            v[r] === void 0 &&
              ((h ??= []).push(v[r] = Tt()), _[r] = Cn(v[r], o));
          }
        } catch (e) {
          if (h) { for (n = 0; n < h.length; n++) h[n].dispose(); }
          throw e;
        }
        for (n = 0; n < s; n++) {
          _[n] = this.Zt[n],
            v[n] = this.ts[n],
            i && (i[n] = this.es[n]),
            a && (a[n] = this.rs[n]);
        }
        for (r = s; r <= l; r++) i && D(i[r], e[r]), a && D(a[r], r);
        for (r = l + 1; r < t; r++) {
          _[r] = this.Zt[r - g],
            v[r] = this.ts[r - g],
            i && (i[r] = this.es[r - g], D(i[r], e[r])),
            a && (a[r] = this.rs[r - g], g !== 0 && D(a[r], r));
        }
        if (
          this.Zt = _,
            this.ts = v,
            i && (this.es = i),
            a && (this.rs = a),
            this.$t = t,
            this.Xt = e.slice(0),
            m
        ) { for (n = 0; n < m.length; n++) m[n].dispose(); }
      }
    }),
    this.Zt;
}
function da(e, t, n) {
  return !e || e(t) === e(n);
}
function fa(e, t, n, r = !1) {
  if (t == null) throw Error(``);
  let i = t?.[O];
  if (i === void 0 || i.px !== t) throw Error(``);
  i.ovl && ui(i);
  let a = n === null ? null : typeof n == `string` ? (e) => e?.[n] : n;
  if (r && e !== t && e?.[O] !== void 0) {
    if ((i.pb ?? i.v) === e) return;
    hi(i, e);
    return;
  }
  let o = A(e);
  if (a) {
    let e = a(i.pb ?? i.v);
    if (e !== void 0 && !ga(a(o), e)) {
      if (!r) throw Error(``);
      (i.fam?.map ?? Or).delete(i.pb ?? i.v), hi(i, o);
      return;
    }
  }
  if (i.fam?.opt === !0 && !be && !Wr()) {
    kr.applyTentative(i, o, a);
    return;
  }
  pa(i, o, a, r);
}
function pa(e, t, n, r = !1) {
  let i = e.pb ?? e.v;
  if (t === i && !Dr.has(i)) return;
  let a = e.fam,
    o = a?.opt === !0 ? kr.optimisticView(e, i) : i,
    s = Array.isArray(t),
    c = a === null,
    l = e.s === !0,
    u = e.v;
  if (
    hi(e, t, c),
      Yr !== null && c && e.pc !== null && e.pc.p !== null &&
      Yr.emitPatchLocal(e, t, u),
      l && zr(t),
      Array.isArray(o) !== s
  ) {
    c && Ni(e, u, t);
    return;
  }
  if (s) {
    let i = o, s = t, d = c ? e.n : null, f = 0;
    if (n && !l) {
      let o = i.length, c = s.length, l = !1, p = 0;
      for (let m = Math.min(o, c); p < m; p++) {
        let o = s[p], c = i[p];
        if (
          c !== o &&
          !(typeof c == `object` && c && typeof o == `object` && o &&
            ga(n(c), n(o)))
        ) break;
        if (
          (c !== o || typeof o == `object` && o && Dr.has(o)) &&
          typeof o == `object` && o && ba(A(c), o, n, a, r),
            e.dk !== null && !l &&
            !(typeof o == `object` && o ? Ei(c, o) : gn(c, o)) &&
            (ai(e), l = !0),
            d !== null
        ) {
          let e = d[p];
          e !== void 0 && (f++, ji(e, p, u[p], o, u, t));
        }
      }
      e.dk !== null && !l && p < s.length && ai(e);
      let m = p, h = null;
      for (; p < s.length; p++) {
        let e = s[p];
        if (typeof e == `object` && e) {
          let t = n(e), o;
          if (t !== void 0) {
            if (h === null) {
              h = new Map();
              for (let e = m; e < i.length; e++) {
                let t = A(i[e]);
                if (typeof t == `object` && t) {
                  let r = n(t);
                  if (r === void 0) continue;
                  let i = h.get(r);
                  i === void 0
                    ? h.set(r, e)
                    : Array.isArray(i)
                    ? i.push(e)
                    : h.set(r, [i, e]);
                }
              }
            }
            let e = h.get(t);
            e === void 0
              ? o = void 0
              : Array.isArray(e)
              ? (o = A(i[e.shift()]), e.length === 1 && h.set(t, e[0]))
              : (o = A(i[e]), h.delete(t));
          } else o = A(i[p]);
          ba(o, e, n, a, r);
        }
        if (d !== null) {
          let e = d[p];
          e !== void 0 && (f++, ki(e, p, u, t, !1));
        }
      }
      Xr !== null && e.pc !== null && e.pc.ro !== null && (m < c || o !== c) &&
        va(e, i, s, m, n);
    } else {
      let o = Math.min(i.length, s.length),
        c = s.length,
        p = !1,
        m = Xr !== null && e.pc !== null ? e.pc.sp : null,
        h = Xr !== null && e.pc !== null ? e.pc.ro : null,
        g = n !== null && (h !== null || m !== null),
        _ = 0;
      for (let h = 0; h < c; h++) {
        let c = s[h];
        if (g && h < o) {
          let e = i[h];
          typeof e == `object` && e && typeof c == `object` && c &&
            ga(n(e), n(c))
            ? _++
            : g = !1;
        }
        if (m !== null && h < o && (n === null || g)) {
          let t = i[h];
          t !== c && Xr.emitSlotPatch(e, h, c, t);
        }
        if (
          !l && h < o && typeof c == `object` && c && ba(A(i[h]), c, n, a, r),
            e.dk !== null && !p &&
            !(typeof c == `object` && c ? Ei(i[h], c) : gn(i[h], c)) &&
            (ai(e), p = !0),
            d !== null
        ) {
          let e = d[h];
          e !== void 0 && (f++, ki(e, h, u, t, !1));
        }
      }
      if (h !== null) {
        let t = i.length;
        n === null
          ? t !== c && va(e, i, s, o, null)
          : (_ < c || t !== c) && va(e, i, s, _, n);
      }
    }
    if (c) {
      if (d !== null && f < e.nc) {
        for (let e of Reflect.ownKeys(d)) {
          let n = typeof e == `string` ? +e : NaN;
          n >= 0 && n < s.length || ki(d[e], e, u, t, !1);
        }
      }
      Mi(e, u, t);
    }
    return;
  }
  {
    if (
      e.pc !== null && e.pc.p !== null && c && e.n === null && e.h === null &&
      e.k === null && e.dk === null && a === null
    ) return;
    let i = c ? e.n : null, s = 0, d = !1;
    for (let c in t) {
      let f = t[c], p = u[c], m = typeof f == `object` && !!f;
      if (
        p === f && (!m || !Dr.has(f)) &&
        (i === null || i[c] === void 0 || !Ai(i[c]))
      ) {
        i !== null && i[c] !== void 0 && s++;
        continue;
      }
      if (
        m && !l && ba(A(o[c]), f, n, a, r),
          e.dk !== null && !d && !(m ? Ei(p, f) : gn(p, f)) && (ai(e), d = !0),
          i !== null
      ) {
        let e = i[c];
        e !== void 0 && (s++, ji(e, c, p, f, u, t));
      }
    }
    let f = Object.getOwnPropertySymbols(t);
    for (let e = 0; e < f.length; e++) {
      let c = f[e], d = t[c];
      if (
        !l && typeof d == `object` && d && ba(A(o[c]), d, n, a, r), i !== null
      ) {
        let e = i[c];
        e !== void 0 && (s++, ji(e, c, u[c], d, u, t));
      }
    }
    if (c) {
      if (i !== null && s < e.nc) {
        for (let e of Reflect.ownKeys(i)) {
          ma.call(t, e) || ki(i[e], e, u, t, !1);
        }
      }
      Mi(e, u, t);
    }
    return;
  }
}
var ma = Object.prototype.hasOwnProperty, ha = (e) => A(e);
function ga(e, t) {
  return e === t || e !== e && t !== t;
}
function _a(e, t) {
  let n = 0, r = e.length < t.length ? e.length : t.length;
  for (; n < r && A(e[n]) === A(t[n]);) n++;
  return n === e.length && n === t.length ? null : ya(e, t, n, ha);
}
function va(e, t, n, r, i) {
  Xr.emitRowOps(e, n, ya(t, n, r, i));
}
function ya(e, t, n, r) {
  let i = e.length, a = t.length, o = Array(a - n), s = null;
  if (r !== null && n < i) {
    s = new Map();
    for (let t = n; t < i; t++) {
      let n = A(e[t]);
      if (typeof n == `object` && n) {
        let e = r(n);
        if (e === void 0) continue;
        let i = s.get(e);
        i === void 0
          ? s.set(e, t)
          : Array.isArray(i)
          ? i.push(t)
          : s.set(e, [i, t]);
      }
    }
  }
  let c = s === null ? null : new Set();
  for (let e = n; e < a; e++) {
    let i = t[e], a = -1;
    if (typeof i == `object` && i && s !== null) {
      let e = r(i);
      if (e !== void 0) {
        let t = s.get(e);
        t !== void 0 &&
          (Array.isArray(t)
            ? (a = t.shift(), t.length === 1 && s.set(e, t[0]))
            : (a = t, s.delete(e)),
            c.add(a));
      }
    }
    o[e - n] = a;
  }
  let l = [];
  for (let t = n; t < i; t++) (c === null || !c.has(t)) && l.push(A(e[t]));
  return { prefix: n, sources: o, removed: l };
}
function ba(e, t, n, r, i = !1) {
  if (typeof e != `object` || !e || typeof t != `object` || !t) return;
  let a = (r?.map ?? Or).get(e);
  if (
    a !== void 0 && k(t) && !(Ir && Lr(t)) &&
    (t = A(t), Array.isArray(e) === Array.isArray(t))
  ) {
    if (n) {
      let r = n(e), i = n(t);
      if (r !== void 0 && i !== void 0 && !ga(r, i)) return;
    }
    (i || n === null || a.d) && pa(a, t, n, i);
  }
}
function xa(e, t, n) {
  let r = (e) => n ? n(e) : e();
  return new Proxy(Array.isArray(e) ? [] : {}, {
    get(r, i) {
      let a, o = be;
      Ur(!0), we(!0);
      try {
        a = e[i];
      } finally {
        Ur(!1), we(o);
      }
      return i === O ? a : typeof a == `object` && a ? xa(a, t, n) : a;
    },
    has(t, n) {
      let r, i = be;
      Ur(!0), we(!0);
      try {
        r = n in e;
      } finally {
        Ur(!1), we(i);
      }
      return r;
    },
    set(n, i, a) {
      if (t && !t()) return !0;
      let o = be;
      Ur(!0), we(!0);
      try {
        r(() => {
          e[i] = a;
        });
      } finally {
        Ur(!1), we(o);
      }
      return !0;
    },
    deleteProperty(n, i) {
      if (t && !t()) return !0;
      let a = be;
      Ur(!0), we(!0);
      try {
        r(() => {
          delete e[i];
        });
      } finally {
        Ur(!1), we(a);
      }
      return !0;
    },
    ownKeys() {
      let t = be;
      Ur(!0), we(!0);
      try {
        return Reflect.ownKeys(e);
      } finally {
        Ur(!1), we(t);
      }
    },
    getOwnPropertyDescriptor(t, n) {
      let r, i = be;
      Ur(!0), we(!0);
      try {
        r = Reflect.getOwnPropertyDescriptor(e, n);
      } finally {
        Ur(!1), we(i);
      }
      return r && (r.configurable = !0), r;
    },
    defineProperty(n, i, a) {
      if (t && !t()) return !0;
      let o = be;
      Ur(!0), we(!0);
      try {
        r(() => {
          Reflect.defineProperty(e, i, a);
        });
      } finally {
        Ur(!1), we(o);
      }
      return !0;
    },
  });
}
function Sa(e, t, n) {
  let r = { map: new WeakMap(), node: null, shallow: !!n?.shallow },
    i = ei(t, null, null, r);
  r.shallow && (i[O].s = !0, zr(t));
  let a;
  n?.seedLoadingValue && (a = { loadingValue: void 0 });
  let o = on(() => {
    r.node ||= St(), wa(i, e, n?.key === void 0 ? `id` : n.key);
  }, a);
  return o.T &= -33, r.node = o, { store: i, node: o };
}
function Ca(e, t, n) {
  let { store: r, node: i } = Sa(e, t, n);
  return [r, (e) => {
    xn(i), oa(r, e);
  }];
}
function wa(e, t, n, r, i) {
  let a = St(), o = !1, s, c = a.Ne ? JSON.parse(JSON.stringify(e[O].v)) : null;
  return oa(xa(e, () => !o || a.o?.Ie === s, i), (i) => {
    s = t(c ?? i), o = !0;
    let l = (t) => {
        if (
          c && (t === void 0 || t === c) && (t = JSON.parse(JSON.stringify(c))),
            t === i || t === void 0
        ) return;
        let a = () => oa(e, (e) => fa(t, e, n, !0), !1);
        r ? r(a, t) : a();
      },
      u = Kt(a, s, l);
    a.Ne || l(u);
  }, !1),
    a;
}
function Ta(e, t, n) {
  return typeof e == `function` ? Ca(e, t, n) : sa(e, !!t?.shallow);
}
function Ea(e, t) {
  let r = on(e, { lazy: !0 });
  return T(r).h = (e, t) => {
    let i = e === void 0 ? r.S : e, a = t === void 0 ? r.o?._ : t;
    r.S &= ~r.R;
    let o = r.C.notify(r, 3, i, a), s = i & ~r.R & 3;
    if (
      s &&
      (r.S &= ~s,
        r.o?._ === a && !(r.S & 3) && r.o !== null && (r.o._ = void 0)),
        !o && i & 2
    ) throw De(n(a)), a;
  },
    r.R = t,
    r.T &= -33,
    rn(r, !0),
    r;
}
function Da(e, t, n, r) {
  let i = e.C;
  return i.addChild(e.C = n),
    Ct(() => i.removeChild(e.C)),
    Cn(e, () => {
      let e = on(t);
      return Ea(() => Na(E(e)), r);
    });
}
var Oa = Symbol(),
  ka = class extends Ae {
    ee;
    v = new Set();
    te;
    U = !0;
    D = pn(!1, { ownedWrite: !0, H: !0 });
    _;
    P = pn(!1, { ownedWrite: !0, H: !0 });
    W;
    L = !1;
    re;
    ne = Oa;
    constructor(e) {
      super(), this.ee = e;
    }
    run(e) {
      if (e && !E(this.D)) return super.run(e);
    }
    notify(e, t, r, i) {
      if (!(t & this.ee)) return super.notify(e, t, r, i);
      if (this.L && this.re) {
        let e = _n(() => {
          try {
            return this.re();
          } catch {
            return Oa;
          }
        });
        e !== this.ne && (this.ne = e, this.L = !1, this.v.clear());
      }
      if (this.ee & 1 && this.L) return super.notify(e, t, r, i);
      if (r & this.ee) {
        this.U = !0;
        let t = i?.source || e.o?._?.source;
        if (t) {
          let e = this.v.size === 0;
          this.v.add(t),
            e && D(this.D, !0),
            this.ee & 2 && D(this._, n(t.o?._));
        }
      }
      return t &= ~this.ee, !t || super.notify(e, t, r, i);
    }
    se() {
      for (let e of this.v) {
        (e.ie & 64 ||
          !e.o?.t && !(e.S & this.ee) && !(this.ee & 2 && e.S & 1)) &&
          this.v.delete(e);
      }
      if (
        !this.v.size &&
        (this.U = this.ee & 1 && this.U && !this.L && this.te
          ? !!(this.te.S & this.ee)
          : !1,
          !this.U && (D(this.D, !1), this.re))
      ) {
        try {
          this.ne = _n(() => this.re());
        } catch {}
      }
    }
  };
function Aa(t, n, r, i) {
  let a = Tt(), o = new ka(t);
  t === 2 && (o._ = pn(void 0, { ownedWrite: !0, H: !0 })), i && (o.re = i);
  let s = o.te = Da(a, n, o, t);
  return _n(() => {
    let n = !1;
    try {
      E(s);
    } catch (t) {
      if (t instanceof e) n = !0;
      else throw t;
    }
    o.U = n || !!(s.S & t) || s.o?._ instanceof e;
  }),
    yr(on(() => {
      if (!E(o.D)) {
        let e = E(s);
        if (!_n(() => E(o.D))) return o.L = !0, e;
      }
      return r(o);
    }, { H: !0 }));
}
function ja(e, t, n) {
  return Aa(1, e, () => t(), n?.on);
}
function Ma(e, t) {
  return Aa(2, e, (e) =>
    t(yr(e._), () => {
      for (let t of e.v) t.oe !== void 0 && rn(t);
      x();
    }));
}
function Na(e, t) {
  if (typeof e == `function` && !e.length) {
    if (t?.doNotUnwrap) return e;
    do e = e(); while (typeof e == `function` && !e.length);
  }
  if (!t?.skipNonRendered || e != null && e !== !0 && e !== !1 && e !== ``) {
    if (Array.isArray(e)) {
      let n = [];
      return Pa(e, n, t)
        ? () => {
          let e = [];
          return Pa(n, e, { ...t, doNotUnwrap: !1 }), e;
        }
        : n;
    }
    return e;
  }
}
function Pa(t, n = [], r) {
  let i = null, a = !1;
  for (let o = 0; o < t.length; o++) {
    try {
      let e = t[o];
      if (typeof e == `function` && !e.length) {
        if (r?.doNotUnwrap) {
          n.push(e), a = !0;
          continue;
        }
        do e = e(); while (typeof e == `function` && !e.length);
      }
      Array.isArray(e) ? a = Pa(e, n, r) || a : r?.skipNonRendered &&
          (e == null || e === !0 || e === !1 || e === ``) || n.push(e);
    } catch (t) {
      if (!(t instanceof e)) throw t;
      i = t;
    }
  }
  if (i) throw i;
  return a;
}
function Fa(e) {
  let t = $e(e);
  return t.sn !== !0 && (t.ze.length !== 0 || t.En.size !== 0);
}
var Ia = !1;
function La() {
  if (Ia) return;
  Ia = !0,
    Ar({
      notifyOptimisticWrites: Ga,
      optimisticView: Ka,
      applyTentative: qa,
      retainsOptimism: Fa,
    }),
    S.qt ||= (e) => {
      for (let t of e) {
        let e = (t?.[O])?.fam?.overlaid;
        if (e !== void 0) {
          for (let t of e) {
            t.pc !== null && t.pc.p !== null &&
            Yr.emitPatchOptimistic(t, null, null),
              t.pc !== null && t.pc.ro !== null &&
              Xr.emitRowOpsOptimistic(t, null, null),
              t.k !== null && Zi(() => D(t.k, (e) => e + 1));
          }
        }
      }
      e.clear();
    };
  let e = S.dn;
  S.dn = (t) => {
    for (let e of t.En) {
      let n = e?.[O]?.fam, r = n?.node;
      if (r == null || !(r.S & 1)) continue;
      let i = n.ft == null ? null : Ba(n.ft);
      if ((i === null || i === $e(t)) && Ra(n)) return !0;
    }
    return e(t);
  };
}
function Ra(e) {
  let t = e.overlaid;
  if (t === void 0 || t.size === 0) return !1;
  for (let e of t) {
    for (let t of [e.n, e.h]) {
      if (t !== null) {
        for (let e of Reflect.ownKeys(t)) {
          let n = t[e];
          if (n.o?.Pe !== void 0 && n.o?.Pe !== g) return !0;
        }
      }
    }
    if (e.k !== null && e.k.o?.Pe !== void 0 && e.k.o?.Pe !== g) return !0;
  }
  return t.clear(), !1;
}
function za(e, t, n) {
  Hn(), La();
  let r = typeof e == `function`;
  !r && n === void 0 && (n = t);
  let i = r ? t : e,
    a = { map: new WeakMap(), node: null, shallow: !!n?.shallow, opt: !0 },
    o = ei(i, null, null, a);
  a.px = o;
  let s = n?.key === void 0 ? `id` : n.key;
  if (
    a.key = typeof s == `function`
      ? s
      : s === null
      ? null
      : (e) => k(e) ? e[s] : void 0,
      a.shallow && (o[O].s = !0, zr(i)),
      r
  ) {
    let t = e,
      r = () => {
        let e = a.ft;
        if (e == null) return;
        let t = Ba(e);
        t === null && (a.ft = t = Qe()), a.node.Ae = t, C.initTransition(t);
      },
      i = (e, t) => {
        let n = Va(a);
        if (n !== null) return void Ha(a, n, t);
        St() !== a.node && r(), Zi(e);
      },
      s = (e) => {
        let t = Va(a);
        t === null ? e() : Ua(t, e);
      },
      c = (e) => {
        if (e.o?.Ie == null) {
          e.Ne || (a.ft = null);
          return;
        }
        if (e.Ne) return;
        let t = b;
        t === null && C.initTransition(t = Qe()), a.ft = t, e.Ae = t;
        let n = t._e.get(e);
        n === void 0 && t._e.set(e, n = new Set()), n.add(e);
      },
      l;
    n?.seedLoadingValue && (l = { loadingValue: void 0 });
    let u = on(() => {
      let e = St();
      try {
        Zi(() => wa(o, t, n?.key === void 0 ? `id` : n.key, i, s));
      } finally {
        c(e);
      }
    }, l);
    u.T &= -33, a.node = u;
  }
  return [o, (e) => {
    let t = b;
    oa(o, e), t !== null && (a.rt ??= new Set()).add(t);
  }];
}
function Ba(e) {
  for (; typeof e.sn == `object`;) e = e.sn;
  return e.sn === !0 ? null : e;
}
function Va(e) {
  let t = e.rt;
  if (t === void 0 || t.size === 0) return null;
  let n = null;
  for (let e of t) {
    let r = Ba(e);
    r === null ? t.delete(e) : n ??= r;
  }
  return n;
}
function Ha(e, t, n) {
  Ua(t, () =>
    Zi(() =>
      oa(e.px, (t) => {
        Wa(t, A(n), e.key ?? null);
      }, !1)
    ));
}
function Ua(e, t) {
  tt(e, t);
  let n = e.Lt;
  for (let t = 0; t < n.length; t++) {
    let r = n[t];
    r.Ae = e, r.T & 128 && !Qi(r) && (r.T |= h);
  }
}
function Wa(e, t, n) {
  let r = Array.isArray(e);
  if (r && Array.isArray(t)) {
    let r = t.length;
    if (n !== null) {
      let i = null, a = e.length;
      for (let t = 0; t < a; t++) {
        let r = A(e[t]);
        if (!k(r)) continue;
        let a = n(r);
        if (a === void 0) continue;
        let o = (i ??= new Map()).get(a);
        o === void 0 ? i.set(a, [r]) : o.push(r);
      }
      let o = e[O]?.n;
      if (o != null) {
        for (let e of Reflect.ownKeys(o)) {
          let t = o[e];
          if (!Qi(t)) continue;
          let r = A(v(t.o.Pe));
          if (!k(r)) continue;
          let a = n(r);
          if (a === void 0) continue;
          let s = (i ??= new Map()).get(a);
          s === void 0 ? i.set(a, [r]) : s.push(r);
        }
      }
      for (let a = 0; a < r; a++) {
        let r = t[a], o;
        if (k(r) && i !== null) {
          let e = n(r);
          if (e !== void 0) {
            for (let [t, n] of i) {
              if (ga(t, e)) {
                o = n.shift(), n.length === 0 && i.delete(t);
                break;
              }
            }
          }
        }
        if (o !== void 0) A(e[a]) !== o && (e[a] = o), Wa(e[a], r, n);
        else {
          let t = A(e[a]);
          !gn(t, r) && !Ei(t, r) && (e[a] = r);
        }
      }
    } else {for (let i = 0; i < r; i++) {
        let r = t[i], a = A(e[i]);
        a !== r &&
          (k(r) && k(a) && Array.isArray(r) === Array.isArray(a)
            ? Wa(e[i], r, n)
            : !gn(a, r) && !Ei(a, r) && (e[i] = r));
      }}
    e.length !== r && (e.length = r);
    return;
  }
  for (let i of Reflect.ownKeys(t)) {
    if (r && i === `length`) continue;
    let a = t[i], o = A(e[i]);
    if (o !== a) {
      if (k(a) && k(o) && Array.isArray(a) === Array.isArray(o)) {
        if (n !== null) {
          let t = n(o), r = n(a);
          if (t !== void 0 && r !== void 0 && !ga(t, r)) {
            e[i] = a;
            continue;
          }
        }
        Wa(e[i], a, n);
      } else !gn(o, a) && !Ei(o, a) && (e[i] = a);
    }
  }
  for (let n of Reflect.ownKeys(e)) {
    r && n === `length` || n in t || delete e[n];
  }
}
function Ga(e, t) {
  let n = e.fam?.ft;
  if (n != null) {
    let e = Ba(n);
    e !== null && C.initTransition(e);
  }
  let r = e.v;
  if (
    e.pc !== null && e.pc.p !== null && Yr.emitPatchOptimistic(e, t, Ka(e, r)),
      e.pc !== null && e.pc.ro !== null && Array.isArray(t)
  ) {
    let n = Ka(e, r);
    if (Array.isArray(n)) {
      let r = _a(n, t);
      r !== null && Xr.emitRowOpsOptimistic(e, t, r);
    }
  }
  let i = (t, n) => {
      let r = e.n?.[t];
      return r !== void 0 && Qi(r) ? v(r.o?.Pe) : n;
    },
    a = (t) => {
      let n = e.h?.[t];
      return n !== void 0 && Qi(n) ? !!v(n.o?.Pe) : t in r;
    },
    o = !1,
    s = Array.isArray(t);
  for (let n of Reflect.ownKeys(t)) {
    if (s && n === `length`) continue;
    let c = A(t[n]);
    if (!a(n)) D(ti(e, n, r[n]), () => c), D(ri(e, n, n in r), !0), o = !0;
    else {
      let t = i(n, r[n]);
      !gn(t, c) && !Ei(t, c) && (D(ti(e, n, t), () => c), s && (o = !0));
    }
  }
  for (let n of Reflect.ownKeys(r)) {
    s && n === `length` || n in t || !a(n) ||
      (D(ti(e, n, r[n]), () => void 0), D(ri(e, n, !0), !1), o = !0);
  }
  if (s) {
    let n = i(`length`, r.length);
    n !== t.length && (D(ti(e, `length`, n), () => t.length), o = !0);
  }
  o && D(ii(e), (e) => e + 1),
    ai(e),
    e.pb = bi.get(e) ?? null,
    e.pb !== null && bi.delete(e),
    (e.fam.overlaid ??= new Set()).add(e),
    S._n?.(e.fam.px ?? e.px);
}
function Ka(e, t) {
  if (e.fam?.opt !== !0 || $i()) return t;
  let n = null, r = () => n ??= Array.isArray(t) ? [...t] : { ...t }, i = e.n;
  if (i !== null) {
    for (let e of Reflect.ownKeys(i)) {
      let n = i[e];
      if (!Qi(n)) continue;
      let a = v(n.o?.Pe);
      e === `length` && Array.isArray(t)
        ? t.length !== a && (r().length = a)
        : gn(t[e], a) || (r()[e] = a);
    }
  }
  let a = e.h;
  if (a !== null) {
    for (let e of Reflect.ownKeys(a)) {
      let i = a[e];
      Qi(i) && !v(i.o?.Pe) && e in (n ?? t) && delete r()[e];
    }
  }
  return n ?? t;
}
function qa(e, t, n) {
  let r = Ka(e, e.pb ?? e.v), i = e.fam.map, a = Array.isArray(t);
  if (Array.isArray(r) !== a) return;
  let o = [],
    s = a ? [...t] : Ja(t),
    c = (e, t) => {
      if (
        !k(e) || !k(t) || Ir && (Lr(e) || Lr(t)) ||
        Array.isArray(e) !== Array.isArray(t)
      ) return null;
      if (n) {
        let r = n(e), i = n(t);
        if (r !== void 0 && i !== void 0 && !ga(r, i)) return null;
      }
      return i.get(A(e)) ?? null;
    };
  if (a) {
    let e = r, i = null;
    for (let r = 0; r < t.length; r++) {
      let a = t[r];
      if (!k(a)) continue;
      let l;
      if (n) {
        let t = n(a);
        if (t !== void 0) {
          if (i === null) {
            i = new Map();
            for (let t = 0; t < e.length; t++) {
              let r = A(e[t]);
              if (k(r)) {
                let e = n(r);
                if (e === void 0) continue;
                let a = i.get(e);
                a === void 0
                  ? i.set(e, t)
                  : Array.isArray(a)
                  ? a.push(t)
                  : i.set(e, [a, t]);
              }
            }
          }
          let r = i.get(t);
          r === void 0
            ? l = void 0
            : Array.isArray(r)
            ? (l = A(e[r.shift()]), r.length === 1 && i.set(t, r[0]))
            : (l = A(e[r]), i.delete(t));
        } else l = A(e[r]);
      } else l = A(e[r]);
      let u = c(l, a);
      u !== null && (s[r] = A(l), o.push([u, a]));
    }
  } else {for (let e of Reflect.ownKeys(t)) {
      let n = A(r[e]), i = t[e], a = c(n, i);
      a !== null && (s[e] = n, o.push([a, i]));
    }}
  let l = e.pb;
  e.pb = null, Ga(e, s), e.pb = l;
  for (let e = 0; e < o.length; e++) qa(o[e][0], A(o[e][1]), n);
}
function Ja(e) {
  let t = {};
  for (let n of Reflect.ownKeys(e)) t[n] = e[n];
  return t;
}
var Ya = !1;
function Xa(e, t) {
  let n = Symbol(t && t.name || ``);
  function r(e) {
    return Et(() => (En(r, e.value), Qa(() => e.children)));
  }
  return r.id = n, r.defaultValue = e, r;
}
function Za(e) {
  return Tn(e);
}
function Qa(e) {
  let t = xr(e, { lazy: !0 }), n = xr(() => Na(t()), { lazy: !0, sync: !0 });
  return n.toArray = () => {
    let e = n();
    return Array.isArray(e) ? e : e == null ? [] : [e];
  },
    n;
}
var $a = { hydrating: !1, registry: void 0, done: !1 },
  eo,
  to,
  no = (...e) => xr(...e),
  ro = (...e) => br(...e),
  io = (...e) => Ma(...e),
  ao = (...e) =>
    typeof e[0] == `function` && $a.hydrating ? eo(Er, e[0], e[1]) : Er(...e),
  oo = (...e) =>
    typeof e[0] == `function` && $a.hydrating
      ? to(Ta, e[0], e[1] ?? {}, e[2])
      : Ta(...e),
  so = (...e) =>
    typeof e[0] == `function` && $a.hydrating
      ? to(za, e[0], e[1] ?? {}, e[2])
      : za(...e),
  co = (...e) => Cr(...e),
  lo = (...e) => Sr(...e),
  uo = (e, t, n) => ja(e, t, n);
function M(e, t) {
  return _n(() => e(t || {}));
}
var fo = (e) => `Stale read from <${e}>.`;
function po(e) {
  let t = `fallback` in e
      ? { keyed: e.keyed, fallback: () => e.fallback }
      : { keyed: e.keyed },
    n = St(),
    r,
    i = () => Cn(n, () => ca(() => e.each, e.children, t));
  $a.hydrating && (r = i());
  let a = () => (r ??= i())();
  return e.keyed !== !1 && !(`fallback` in e) && e.children.length < 2 &&
    (a.$ll = { each: () => e.each, row: e.children, keyed: e.keyed }),
    a;
}
function mo(e) {
  let t = e.keyed,
    n = xr(() => e.when, void 0),
    r = t ? n : xr(n, { equals: (e, t) => !e == !t, sync: !0 });
  return xr(() => {
    let i = r();
    if (i) {
      let a = e.children;
      return typeof a == `function` && a.length > 0
        ? _n(
          t ? () => a(i) : () =>
            a(() => {
              if (!_n(r)) throw fo(`Show`);
              return n();
            }),
          Ya,
        )
        : a;
    }
    return e.fallback;
  }, { sync: !0 });
}
function ho(e) {
  let t = Qa(() => e.children),
    n = xr(() => {
      let e = t.toArray(), n = () => void 0;
      for (let t = 0; t < e.length; t++) {
        let r = t, i = e[t];
        if (i == null) continue;
        let a = n,
          o = xr(() => a() ? void 0 : i.when, void 0),
          s = i.keyed ? o : xr(o, { equals: (e, t) => !e == !t, sync: !0 });
        n = () => {
          let e = a();
          if (e) return e;
          let t = s();
          return t ? [r, t, o, i] : void 0;
        };
      }
      return n;
    }, { sync: !0 });
  return xr(() => {
    let t = n()();
    if (!t) return e.fallback;
    let [r, i, a, o] = t, s = o.children;
    return typeof s == `function` && s.length > 0
      ? o.keyed ? _n(() => s(i), Ya) : _n(() =>
        s(() => {
          if (_n(n)()?.[0] !== r) throw fo(`Match`);
          return a();
        }), Ya)
      : s;
  }, { sync: !0 });
}
function go(e) {
  return e;
}
function _o(e) {
  return io(() => e.children, (t, n) => {
    let r = e.fallback;
    return typeof r == `function` && r.length ? r(t, n) : r;
  });
}
function vo(e) {
  return uo(
    () => e.children,
    () => e.fallback,
    `on` in e ? { on: () => e.on } : void 0,
  );
}
var yo = Symbol(`slot`),
  bo = Symbol(`host`),
  xo = { transparent: !0, sync: !0 },
  So = { sync: !0 };
function Co(e, t, n) {
  co(e, t, n ? { sync: !0, ...n, transparent: !n.scope } : xo);
}
function wo(e) {
  return no(() => e(), So);
}
function To(e, t, n, r) {
  let i = n.length,
    a = t.length,
    o = i,
    s = 0,
    c = 0,
    l = t[a - 1],
    u = l[yo],
    d = l.parentNode === e && (!u || u === r) ? l.nextSibling : r || null,
    f = null,
    p,
    m,
    h = (t) => {
      if (!t) return !1;
      let n = t[yo];
      return t.parentNode === e && (!n || n === r);
    };
  for (; s < a || c < o;) {
    if (t[s] === n[c] && h(t[s])) {
      s++, c++;
      continue;
    }
    for (; t[a - 1] === n[o - 1] && h(t[a - 1]);) a--, o--;
    if (a === s) {
      let t;
      if (o < i) {
        if (c) {
          let i = n[c - 1], a = i[yo];
          t = i.parentNode === e && (!a || a === r) ? i.nextSibling : d;
        } else t = n[o - c];
      } else t = d;
      for (; c < o;) {
        let i = n[c++];
        e.insertBefore(i, t), r && (i[yo] = r);
      }
    } else if (o === c) {
      for (; s < a;) {
        let n = t[s++];
        if (!f || !f.has(n)) {
          let t = n[yo];
          n.parentNode === e && (!t || t === r) && n.remove();
        }
      }
    } else if (
      (p = t[s]) === n[o - 1] && n[c] === t[a - 1] && p.parentNode === e &&
      (!(m = p[yo]) || m === r)
    ) {
      if (r) {
        do {
          let n = t[--a];
          if (e.insertBefore(n, p), n[yo] = r, c++, s >= a - 1 || c >= o) break;
        } while (t[s] === n[o - 1] && n[c] === t[a - 1]);
      } else {do if (
          e.insertBefore(t[--a], p), c++, s >= a - 1 || c >= o
        ) break; while (t[s] === n[o - 1] && n[c] === t[a - 1]);}
    } else {
      if (!f) {
        f = new Map();
        let e = c;
        for (; e < o;) f.set(n[e], e++);
      }
      let i = f.get(t[s]);
      if (i != null) {
        if (c < i && i < o) {
          let l = s, u = 1, p;
          for (
            ;
            ++l < a && l < o && (p = f.get(t[l])) != null && p === i + u;
          ) u++;
          if (u > i - c) {
            let a = t[s],
              o = a[yo],
              l = a.parentNode === e && (!o || o === r) ? a : d;
            for (; c < i;) {
              let t = n[c++];
              e.insertBefore(t, l), r && (t[yo] = r);
            }
          } else {
            let i = t[s++], a = n[c++], o = i[yo];
            i.parentNode === e && (!o || o === r)
              ? e.replaceChild(a, i)
              : e.insertBefore(a, d), r && (a[yo] = r);
          }
        } else s++;
      } else {
        let n = t[s++], i = n[yo];
        n.parentNode === e && (!i || i === r) && n.remove();
      }
    }
  }
}
var Eo = `_$SOLID_EVENT_OWNER`,
  Do = Symbol(),
  Oo = {},
  ko = new Set(),
  Ao = new Map();
function jo(e, t, n, r = {}) {
  let i;
  Po(t);
  try {
    Et((a) => {
      if (i = a, t === document) {
        let t = e();
        Co(() => Na(t), () => {});
      } else {
        let i = e();
        P(t, () => i, t.firstChild ? null : void 0, n, {
          ...r.insertOptions,
          schedule: !0,
        });
      }
    }, { id: r.renderId }), Je();
  } catch (e) {
    throw i && i(), Fo(t), e;
  }
  return () => {
    i(), Fo(t), t.textContent = ``;
  };
}
function Mo(e, t, n) {
  let r = document.createElement(`template`);
  return r.innerHTML = e,
    n === 2 ? r.content.firstChild.firstChild : r.content.firstChild;
}
function N(e, t) {
  let n;
  return t === 1
    ? (r) => document.importNode(n ||= Mo(e, r, t), !0)
    : (r) => (n ||= Mo(e, r, t)).cloneNode(!0);
}
function No(e) {
  for (let t = 0, n = e.length; t < n; t++) {
    let n = e[t];
    ko.has(n) || (ko.add(n), Ao.forEach((e, t) => Ro(n, t, e)));
  }
}
function Po(e) {
  let t = Io(e, e);
  t && (t.roots = (t.roots || 0) + 1);
}
function Fo(e) {
  let t = Ao.get(e);
  t && (t.roots > 1 ? t.roots-- : delete t.roots), Lo(e, e);
}
function Io(e, t = e) {
  if (!e || !t) return;
  let n = Ao.get(e);
  return n || Ao.set(e, n = { owners: new Map(), handlers: new Map() }),
    n.owners.set(t, (n.owners.get(t) || 0) + 1),
    ko.forEach((t) => Ro(t, e, n)),
    n;
}
function Lo(e, t = e) {
  let n = Ao.get(e);
  if (!n) return;
  let r = n.owners.get(t);
  r > 1 ? n.owners.set(t, r - 1) : n.owners.delete(t),
    !n.owners.size &&
    (n.handlers.forEach((t, n) => e.removeEventListener(n, t)), Ao.delete(e));
}
function Ro(e, t, n) {
  if (n.handlers.has(e)) return;
  let r = (e) => es(e, t, n);
  n.handlers.set(e, r), t.addEventListener(e, r);
}
function zo(e, t) {
  let n = e, r = 0;
  for (; n;) {
    if (t.owners.has(n)) return { owner: n, distance: r };
    r++, n = n._$host || n.parentNode || n.host;
  }
}
var Bo = null;
function Vo(e) {
  if (Bo !== null) { for (let t = 0; t < Bo.length; t++) Bo[t](e); }
  return e;
}
function Ho(e, t, n) {
  if (Zo(e)) return;
  let r = t === `multiple` && e.localName === `select`;
  if (n == null || n === !1) e.removeAttribute(t);
  else if (e.setAttribute(t, n === !0 ? `` : n), r && !e._$multiple) {
    let t = e.options;
    for (let e = 0; e < t.length; e++) {
      t[e].defaultSelected && (t[e].selected = !0);
    }
  }
  r && (e._$multiple = !0),
    Bo !== null && (t === `href` || t === `action`) && Vo(e);
}
function Uo(e, t, n) {
  if (
    typeof t == `number` && (t = `` + t),
      typeof n == `number` && (n = `` + n),
      Zo(e)
  ) {
    e._$classes = t && typeof t == `object` ? Qo(t) : void 0;
    return;
  }
  if (t == null || t === !1) {
    (n || e._$classes) && (e.removeAttribute(`class`), e._$classes = void 0);
    return;
  }
  if (typeof t == `string`) {
    e._$classes = void 0, t !== n && e.setAttribute(`class`, t);
    return;
  }
  let r;
  typeof n == `string`
    ? (r = {}, e.removeAttribute(`class`))
    : r = e._$classes || Qo(n || {}), t = Qo(t);
  let i = Object.keys(t), a = Object.keys(r), o, s;
  for (o = 0, s = a.length; o < s; o++) {
    let n = a[o];
    n && n !== `undefined` && !t[n] && e.classList.remove(n);
  }
  for (o = 0, s = i.length; o < s; o++) {
    let n = i[o], a = !!t[n];
    n && n !== `undefined` && r[n] !== a && a && e.classList.add(n);
  }
  e._$classes = t;
}
function Wo(e, t, n, r) {
  if (r) {
    let r = `$$${t}`, i;
    Array.isArray(n) ? (i = n[1], e[r] = n[0]) : e[r] = n, e[`${r}Data`] = i;
    return;
  }
  if (Array.isArray(n)) {
    let r = n[0], i = (t) => r.call(e, n[1], t);
    return i[Do] = n, e.addEventListener(t, i), i;
  }
  return e.addEventListener(t, n, typeof n != `function` && n), n;
}
function Go(e, t) {
  Array.isArray(e) ? e.flat(1 / 0).forEach((e) => e && e(t)) : e(t);
}
function Ko(e, t) {
  let n = _n(e);
  Cn(null, () => Go(n, t));
}
var qo = { scope: !0 }, Jo = null;
function Yo(e, t) {
  let n = Jo;
  Jo = e;
  try {
    return t();
  } finally {
    Jo = n;
  }
}
var Xo = null;
function P(e, t, n, r, i) {
  let a = n !== void 0, o = i && i.host;
  if (
    a && !r && (r = []),
      Xo !== null && (r = Xo.claimInitial(e, a, r)),
      typeof t != `function` &&
      (t = Yo(e, () => ns(t, r, a, !0)), typeof t != `function`)
  ) {
    ts(e, t, r, n), o && rs(t, o);
    return;
  }
  if (a && r.length === 0) {
    let t = document.createTextNode(``);
    e.insertBefore(t, n), r = [t];
  }
  let s = r;
  Co((r) => {
    Xo !== null && (s = Xo.reclaimRegion(s, e, n));
    let c = Yo(e, () => ns(t(), s, a, !0));
    return typeof c == `function`
      ? (Co(
        () => (Xo !== null && (s = Xo.reclaimRegion(s, e, n)),
          Yo(e, () => ns(c, s, a))),
        (t) => {
          s = ts(e, t, s, n), o && rs(s, o);
        },
        r !== void 0 && !(i && i.schedule) ? { ...i, schedule: !0 } : i,
      ),
        Oo)
      : c;
  }, (t) => {
    t !== Oo && (s = ts(e, t, s, n), o && rs(s, o));
  }, t.$s ? i ? { ...i, scope: !0 } : qo : i);
}
function Zo(e) {
  if (!$a.hydrating) return !1;
  if (!e || e.isConnected) return !0;
  let t = $a.claimRoots;
  if (t) { for (let n = 0; n < t.length; n++) if (t[n].contains(e)) return !0; }
  return !1;
}
function Qo(e) {
  if (Array.isArray(e)) {
    let t = {};
    $o(e, t), e = t;
  }
  if (e && typeof e == `object`) {
    let t = {}, n = Object.keys(e);
    for (let r = 0, i = n.length; r < i; r++) {
      let i = n[r];
      if (!e[i]) continue;
      let a = i.trim().split(/\s+/);
      for (let e = 0, n = a.length; e < n; e++) a[e] && (t[a[e]] = !0);
    }
    return t;
  }
  return e;
}
function $o(e, t) {
  for (let n = 0, r = e.length; n < r; n++) {
    let r = e[n];
    Array.isArray(r)
      ? $o(r, t)
      : typeof r == `object` && r
      ? Object.assign(t, r)
      : typeof r != `boolean` && (r || r === 0) && (t[r] = !0);
  }
}
function es(e, t, n) {
  if (Xo !== null && Xo.dedupEvent(e)) return;
  let r = e[Eo], i;
  if (r) {
    if (r === !0 || r === t || !t.contains(r)) return;
    i = r;
  }
  let a = n &&
    (n.owners.size === 1 && n.owners.has(t) ? t : zo(e.target, n)?.owner);
  if (n && !a || a && a === i) return;
  e[Eo] = a || !0;
  let o = i || e.target,
    s = `$$${e.type}`,
    c = e.target,
    l = a || t || e.currentTarget,
    u = (t) =>
      Object.defineProperty(e, "target", { configurable: !0, value: t }),
    d = () => {
      let t = o[s];
      if (t === void 0 && o.hasAttribute && o.hasAttribute(`_bnd`)) {
        let n = globalThis[Symbol.for(`solid.bnd`)];
        n && (t = n.resolve(o, e.type));
      }
      if (t && !o.disabled) {
        let n = o[`${s}Data`];
        if (
          n === void 0
            ? typeof t == `function` ? t.call(o, e) : t.handleEvent(e)
            : t.call(o, n, e), e.cancelBubble
        ) return;
      }
      return o.host && typeof o.host != `string` && !o.host._$host &&
        o.contains(e.target) && u(o.host),
        !0;
    },
    f = () => {
      for (; o && d() && o !== l && o.parentNode !== l;) {
        o = o._$host || o.parentNode || o.host;
      }
    };
  if (
    Object.defineProperty(e, "currentTarget", {
      configurable: !0,
      get() {
        return o || l || document;
      },
    }), i
  ) {
    i === e.target && (o = i._$host || i.parentNode || i.host),
      o && o !== l && f();
  } else if (e.composedPath) {
    let t = e.composedPath();
    if (t.length) {
      u(t[0]);
      for (let e = 0; e < t.length && (o = t[e], d()); e++) {
        if (o._$host) {
          o = o._$host, f();
          break;
        }
        if (o === l || o.parentNode === l) break;
      }
    } else f();
  } else f();
  u(c);
}
function ts(e, t, n, r) {
  if (Xo !== null && Zo(e)) {
    if (t && t !== n) {
      let e = Array.isArray(t);
      for (let r of e ? t : [t]) {
        if (r && r.nodeType) { if (!Zo(r)) return n; }
        else if (e && (typeof r == `string` || typeof r == `number`)) return n;
      }
    }
    return t;
  }
  if (t === n) return t;
  let i = typeof t, a = r !== void 0;
  if (i === `string` || i === `number`) {
    let r = typeof n;
    r === `string` || r === `number`
      ? e.firstChild.data = t
      : as(e, n)
      ? e.textContent = t
      : (os(e, n), e.insertBefore(document.createTextNode(t), e.firstChild));
  } else if (t === void 0) ss(e, n, r);
  else if (t.nodeType) {
    Array.isArray(n)
      ? ss(e, n, a ? r : null, t)
      : n && n.nodeType
      ? n.parentNode === e ? e.replaceChild(t, n) : e.appendChild(t)
      : n && e.firstChild
      ? e.replaceChild(t, e.firstChild)
      : e.appendChild(t), r && (t[yo] = r);
  } else if (Array.isArray(t)) {
    let i = n && Array.isArray(n);
    for (let e = 0, r = t.length; e < r; e++) {
      let r = t[e], a = typeof r;
      if (a === `string` || a === `number`) {
        let a = i ? n[e] : void 0;
        a && a.nodeType === 3
          ? (a.data !== `` + r && (a.data = r), t[e] = a)
          : t[e] = document.createTextNode(r);
      }
    }
    t.length === 0
      ? ss(e, n, r)
      : i
      ? n.length === 0 ? is(e, t, r) : To(e, n, t, r)
      : (n && ss(e, n), is(e, t));
  }
  return t;
}
function ns(e, t, n, r) {
  if (
    e = Na(e, { skipNonRendered: !0, doNotUnwrap: r }),
      r && typeof e == `function`
  ) return e;
  if (
    n && !Array.isArray(e) && (e = [e ?? ``]), $a.hydrating && Array.isArray(e)
  ) {
    for (let n = 0, r = e.length; n < r; n++) {
      let r = e[n], i = t && t[n], a = typeof r;
      (a === `string` || a === `number`) && i && i.nodeType === 3 && Zo(i) &&
        (e[n] = i);
    }
  }
  return e;
}
function rs(e, t) {
  if (Array.isArray(e)) {
    for (let n = 0, r = e.length; n < r; n++) {
      rs(e[n], t);
    }
  } else {e && e.nodeType && e[bo] !== t &&
      (e[bo] = t,
        Object.defineProperty(e, "_$host", { get: t, configurable: !0 }));}
}
function is(e, t, n = null) {
  for (let r = 0, i = t.length; r < i; r++) {
    let i = t[r];
    e.insertBefore(i, n), n && (i[yo] = n);
  }
}
function as(e, t) {
  if (t == null) return !0;
  if (Array.isArray(t)) {
    return t.length
      ? e.firstChild === t[0] && e.lastChild === t[t.length - 1]
      : e.firstChild === null;
  }
  if (t === ``) return e.firstChild === null;
  if (t.nodeType) return e.firstChild === t && e.lastChild === t;
  let n = e.firstChild;
  return n !== null && n.nodeType === 3 && e.lastChild === n;
}
function os(e, t) {
  if (Array.isArray(t)) {
    for (let n = 0; n < t.length; n++) {
      let r = t[n];
      r.parentNode === e && r.remove();
    }
  } else if (t.nodeType) t.parentNode === e && t.remove();
  else {
    let t = e.firstChild;
    t && t.nodeType === 3 && t.remove();
  }
}
function ss(e, t, n, r) {
  if (n === void 0) return as(e, t) ? e.textContent = `` : os(e, t);
  if (t.length) {
    let i = !1;
    for (let a = t.length - 1; a >= 0; a--) {
      let o = t[a];
      if (r !== o) {
        let t = o[yo], s = o.parentNode === e && (!t || t === n);
        r && !i && !a
          ? s ? e.replaceChild(r, o) : e.insertBefore(r, n)
          : s && o.remove();
      } else i = !0;
    }
  } else r && e.insertBefore(r, n);
  r && n && (r[yo] = n);
}
var cs = (e, t) => {
    switch (t.length) {
      case 0:
        return e;
      case 1:
        return t[0](e);
      case 2:
        return t[1](t[0](e));
      case 3:
        return t[2](t[1](t[0](e)));
      case 4:
        return t[3](t[2](t[1](t[0](e))));
      case 5:
        return t[4](t[3](t[2](t[1](t[0](e)))));
      case 6:
        return t[5](t[4](t[3](t[2](t[1](t[0](e))))));
      case 7:
        return t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))));
      case 8:
        return t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e))))))));
      case 9:
        return t[8](t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))))));
      default: {
        let n = e;
        for (let e = 0, r = t.length; e < r; e++) n = t[e](n);
        return n;
      }
    }
  },
  F = function (e, t) {
    if (typeof e == `function`) {
      return function () {
        return e(arguments)
          ? t.apply(this, arguments)
          : (e) => t(e, ...arguments);
      };
    }
    switch (e) {
      case 0:
      case 1:
        throw RangeError(`Invalid arity ${e}`);
      case 2:
        return function (e, n) {
          return arguments.length >= 2 ? t(e, n) : function (n) {
            return t(n, e);
          };
        };
      case 3:
        return function (e, n, r) {
          return arguments.length >= 3 ? t(e, n, r) : function (r) {
            return t(r, e, n);
          };
        };
      default:
        return function () {
          if (arguments.length >= e) return t.apply(this, arguments);
          let n = arguments;
          return function (e) {
            return t(e, ...n);
          };
        };
    }
  },
  I = (e) => e,
  ls = (e) => () => e,
  us = ls(!0),
  ds = ls(void 0),
  fs = ds;
function ps(e, ...t) {
  return cs(e, t);
}
function ms(e, t, n, r, i, a, o, s, c) {
  switch (arguments.length) {
    case 1:
      return e;
    case 2:
      return function () {
        return t(e.apply(this, arguments));
      };
    case 3:
      return function () {
        return n(t(e.apply(this, arguments)));
      };
    case 4:
      return function () {
        return r(n(t(e.apply(this, arguments))));
      };
    case 5:
      return function () {
        return i(r(n(t(e.apply(this, arguments)))));
      };
    case 6:
      return function () {
        return a(i(r(n(t(e.apply(this, arguments))))));
      };
    case 7:
      return function () {
        return o(a(i(r(n(t(e.apply(this, arguments)))))));
      };
    case 8:
      return function () {
        return s(o(a(i(r(n(t(e.apply(this, arguments))))))));
      };
    case 9:
      return function () {
        return c(s(o(a(i(r(n(t(e.apply(this, arguments)))))))));
      };
  }
}
var hs = (e) => {
    let t = new Set(Reflect.ownKeys(e));
    if (e.constructor === Object) return t;
    e instanceof Error && t.delete(`stack`);
    let n = Object.getPrototypeOf(e), r = n;
    for (; r !== null && r !== Object.prototype;) {
      let e = Reflect.ownKeys(r);
      for (let n = 0; n < e.length; n++) t.add(e[n]);
      r = Object.getPrototypeOf(r);
    }
    return t.has(`constructor`) && typeof e.constructor == `function` &&
      n === e.constructor.prototype && t.delete(`constructor`),
      t;
  },
  gs = new WeakSet();
function _s(e) {
  return typeof e == `number`;
}
function vs(e) {
  return typeof e == `function`;
}
function ys(e) {
  return typeof e == `object` && !!e || vs(e);
}
var bs = F(2, (e, t) => ys(e) && t in e),
  xs = `~effect/interfaces/Hash`,
  L = (e) => {
    switch (typeof e) {
      case `number`:
        return Es(e);
      case `bigint`:
        return R(e.toString(10));
      case `boolean`:
        return R(String(e));
      case `symbol`:
        return R(String(e));
      case `string`:
        return R(e);
      case `undefined`:
        return R(`undefined`);
      case `function`:
      case `object`:
        if (e === null) return R(`null`);
        if (e instanceof Date) {
          return Number.isNaN(e.getTime())
            ? R(`Invalid Date`)
            : R(e.toISOString());
        }
        if (e instanceof RegExp) return R(e.toString());
        {
          if (gs.has(e)) return Ss(e);
          if (Ps.has(e)) return Ps.get(e);
          let t = Is(
            e,
            () =>
              Ts(e)
                ? e[xs]()
                : typeof e == `function`
                ? Ss(e)
                : e instanceof DataView
                ? As(new Uint8Array(e.buffer, e.byteOffset, e.byteLength))
                : Array.isArray(e) || ArrayBuffer.isView(e)
                ? As(e)
                : e instanceof Map
                ? js(e)
                : e instanceof Set
                ? Ms(e)
                : Os(e),
          );
          return Ps.set(e, t), t;
        }
      default:
        throw Error(
          `BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`,
        );
    }
  },
  Ss = (e) => (Ns.has(e) ||
    Ns.set(e, Es(Math.floor(Math.random() * (2 ** 53 - 1)))),
    Ns.get(e)),
  Cs = F(2, (e, t) => e * 53 ^ t),
  ws = (e) => e & 3221225471 | e >>> 1 & 1073741824,
  Ts = (e) => bs(e, xs),
  Es = (e) => {
    if (e !== e) return R(`NaN`);
    if (e === 1 / 0) return R(`Infinity`);
    if (e === -1 / 0) return R(`-Infinity`);
    let t = e | 0;
    for (t !== e && (t ^= e * 4294967295); e > 4294967295;) {
      t ^= e /= 4294967295;
    }
    return ws(t);
  },
  R = (e) => {
    let t = 5381, n = e.length;
    for (; n;) t = t * 33 ^ e.charCodeAt(--n);
    return ws(t);
  },
  Ds = (e, t) => {
    let n = 12289;
    for (let r of t) n ^= Cs(L(r), L(e[r]));
    return ws(n);
  },
  Os = (e) => Ds(e, hs(e)),
  ks = (e, t) => (n) => {
    let r = e;
    for (let e of n) r ^= t(e);
    return ws(r);
  },
  As = ks(6151, L),
  js = ks(R(`Map`), ([e, t]) => Cs(L(e), L(t))),
  Ms = ks(R(`Set`), L),
  Ns = new WeakMap(),
  Ps = new WeakMap(),
  Fs = new WeakSet();
function Is(e, t) {
  if (Fs.has(e)) return R(`[Circular]`);
  Fs.add(e);
  let n = t();
  return Fs.delete(e), n;
}
var Ls = `~effect/interfaces/Equal`;
function Rs() {
  return arguments.length === 1
    ? (e) => zs(e, arguments[0])
    : zs(arguments[0], arguments[1]);
}
function zs(e, t) {
  if (e === t) return !0;
  if (e == null || t == null) return !1;
  let n = typeof e;
  return n === typeof t
    ? n === `number` && e !== e && t !== t
      ? !0
      : n !== `object` && n !== `function` || gs.has(e) || gs.has(t)
      ? !1
      : Ws(e, t, Us)
    : !1;
}
function Bs(e, t, n) {
  let r = Vs.has(e), i = Hs.has(t);
  if (r && i) return !0;
  if (r || i) return !1;
  Vs.add(e), Hs.add(t);
  let a = n();
  return Vs.delete(e), Hs.delete(t), a;
}
var Vs = new WeakSet(), Hs = new WeakSet();
function Us(e, t) {
  if (L(e) !== L(t)) return !1;
  if (e instanceof Date) {
    if (!(t instanceof Date)) return !1;
    let n = e.getTime(), r = t.getTime();
    return n === r || Number.isNaN(n) && Number.isNaN(r);
  }
  if (e instanceof RegExp) {
    return t instanceof RegExp && e.toString() === t.toString();
  }
  let n = $s(e), r = $s(t);
  if (n !== r) return !1;
  let i = n && r;
  return typeof e == `function` && !i ? !1 : Bs(e, t, () => {
    if (i) return e[Ls](t);
    if (Array.isArray(e)) {
      return !Array.isArray(t) || e.length !== t.length ? !1 : Ks(e, t);
    }
    if (ArrayBuffer.isView(e)) {
      let n = e instanceof DataView;
      if (
        !ArrayBuffer.isView(t) || e.byteLength !== t.byteLength ||
        n !== t instanceof DataView
      ) return !1;
      if (n) {
        let n = t;
        return qs(
          new Uint8Array(e.buffer, e.byteOffset, e.byteLength),
          new Uint8Array(n.buffer, n.byteOffset, n.byteLength),
        );
      }
      return qs(e, t);
    }
    return e instanceof Map
      ? !(t instanceof Map) || e.size !== t.size ? !1 : Xs(e, t)
      : e instanceof Set
      ? !(t instanceof Set) || e.size !== t.size ? !1 : Qs(e, t)
      : Js(e, t);
  });
}
function Ws(e, t, n) {
  let r = Gs.get(e);
  if (!r) r = new WeakMap(), Gs.set(e, r);
  else if (r.has(t)) return r.get(t);
  let i = n(e, t);
  r.set(t, i);
  let a = Gs.get(t);
  return a || (a = new WeakMap(), Gs.set(t, a)), a.set(e, i), i;
}
var Gs = new WeakMap();
function Ks(e, t) {
  for (let n = 0; n < e.length; n++) if (!zs(e[n], t[n])) return !1;
  return !0;
}
function qs(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function Js(e, t) {
  let n = hs(e), r = hs(t);
  if (n.size !== r.size) return !1;
  for (let i of n) if (!r.has(i) || !zs(e[i], t[i])) return !1;
  return !0;
}
function Ys(e, t) {
  return function (n, r) {
    let i = Array.from(r);
    for (let [r, a] of n) {
      let n = !1;
      for (let o = 0; o < i.length; o++) {
        let [s, c] = i[o];
        if (e(r, s) && t(a, c)) {
          i[o] = i[i.length - 1], i.pop(), n = !0;
          break;
        }
      }
      if (!n) return !1;
    }
    return !0;
  };
}
var Xs = Ys(zs, zs);
function Zs(e) {
  return function (t, n) {
    let r = Array.from(n);
    for (let n of t) {
      let t = !1;
      for (let i = 0; i < r.length; i++) {
        let a = r[i];
        if (e(n, a)) {
          r[i] = r[r.length - 1], r.pop(), t = !0;
          break;
        }
      }
      if (!t) return !1;
    }
    return !0;
  };
}
var Qs = Zs(zs), $s = (e) => bs(e, Ls), ec = (e) => e.length > 0;
function tc(e, t, n) {
  t === `__proto__`
    ? Object.defineProperty(e, t, {
      value: n,
      writable: !0,
      enumerable: !0,
      configurable: !0,
    })
    : e[t] = n;
}
function nc(e, t) {
  for (let n of Reflect.ownKeys(t)) {
    Object.prototype.propertyIsEnumerable.call(t, n) && tc(e, n, t[n]);
  }
}
var rc = Symbol.for(`~effect/Redactable`), ic = (e) => bs(e, rc);
function ac(e) {
  return ic(e) ? oc(e) : e;
}
function oc(e) {
  return e[rc](globalThis[`~effect/Fiber/currentFiber`]?.context ?? lc);
}
var sc = `~effect/Fiber/currentFiber`,
  cc = new Map(),
  lc = {
    "~effect/Context": {},
    base: cc,
    depth: 0,
    mapUnsafe: cc,
    pipe() {
      return cs(this, arguments);
    },
  };
function uc(e, t) {
  let n = t?.space ?? 0,
    r = new WeakSet(),
    i = n ? typeof n == `number` ? ` `.repeat(n) : n : ``,
    a = (e) => i.repeat(e),
    o = (e, t) => {
      let n = e?.constructor;
      return n && n !== Object.prototype.constructor && n.name
        ? `${n.name}(${t})`
        : t;
    },
    s = (e) => {
      try {
        return Reflect.ownKeys(e);
      } catch {
        return [`[ownKeys threw]`];
      }
    };
  function c(e, n = 0) {
    if (typeof e == `string`) return JSON.stringify(e);
    if (
      typeof e == `number` || e == null || typeof e == `boolean` ||
      typeof e == `symbol`
    ) return String(e);
    if (typeof e == `bigint`) return String(e) + `n`;
    if (typeof e == `object` || typeof e == `function`) {
      if (r.has(e)) return dc;
      r.add(e);
      let l;
      if (rc in e) l = c(oc(e), n);
      else if (Array.isArray(e)) {
        l = !i || e.length <= 1
          ? `[${e.map((e) => c(e, n)).join(`,`)}]`
          : `[\n${a(n + 1)}${
            e.map((e) => c(e, n + 1)).join(
              `,
` + a(n + 1),
            )
          }\n${a(n)}]`;
      } else if (e instanceof Date) l = pc(e);
      else if (
        !t?.ignoreToString && bs(e, `toString`) &&
        typeof e.toString == `function` &&
        e.toString !== Object.prototype.toString &&
        e.toString !== Array.prototype.toString
      ) {
        let t = mc(e);
        l = e instanceof Error && e.cause
          ? `${t} (cause: ${c(e.cause, n)})`
          : t;
      } else if (Symbol.iterator in e) {
        l = `${e.constructor.name}(${c(Array.from(e), n)})`;
      } else {
        let t = s(e);
        if (!i || t.length <= 1) {
          let r = `{${t.map((t) => `${fc(t)}:${c(e[t], n)}`).join(`,`)}}`;
          l = o(e, r);
        } else {
          let r = `{\n${
            t.map((t) => `${a(n + 1)}${fc(t)}: ${c(e[t], n + 1)}`).join(`,
`)
          }\n${a(n)}}`;
          l = o(e, r);
        }
      }
      return r.delete(e), l;
    }
    return String(e);
  }
  return c(e, 0);
}
var dc = `[Circular]`;
function fc(e) {
  return typeof e == `string` ? JSON.stringify(e) : String(e);
}
function pc(e) {
  try {
    return e.toISOString();
  } catch {
    return `Invalid Date`;
  }
}
function mc(e) {
  try {
    let t = e.toString();
    return typeof t == `string` ? t : String(t);
  } catch {
    return `[toString threw]`;
  }
}
var hc = Symbol.for(`nodejs.util.inspect.custom`),
  gc = (e) => {
    try {
      return e = ac(e),
        bs(e, `toJSON`) && vs(e.toJSON) && e.toJSON.length === 0
          ? e.toJSON()
          : Array.isArray(e)
          ? e.map(gc)
          : e;
    } catch {
      return `[toJSON threw]`;
    }
  },
  _c = class e {
    called = !1;
    self;
    constructor(e) {
      this.self = e;
    }
    next(e) {
      return this.called
        ? { value: e, done: !0 }
        : (this.called = !0, { value: this.self, done: !1 });
    }
    [Symbol.iterator]() {
      return new e(this.self);
    }
  },
  vc = (() => {
    let e = `~effect/Utils/internal`,
      t = { [e]: (e) => e() },
      n = {
        [e]: (e) => {
          try {
            return e();
          } finally {
          }
        },
      };
    return t[e](() => Error().stack)?.includes(e) === !0 ? t[e] : n[e];
  })(),
  yc = `~effect/Effect`,
  bc = `~effect/Exit`,
  xc = { _A: I, _E: I, _R: I },
  Sc = `${yc}/identifier`,
  z = `${yc}/args`,
  B = `${yc}/evaluate`,
  Cc = `${yc}/successCont`,
  wc = `${yc}/failureCont`,
  Tc = `${yc}/ensureCont`,
  Ec = Symbol.for(`effect/Effect/Yield`),
  Dc = {
    pipe() {
      return cs(this, arguments);
    },
    toJSON() {
      return { ...this };
    },
    toString() {
      return uc(this.toJSON(), { ignoreToString: !0, space: 2 });
    },
    [hc]() {
      return this.toJSON();
    },
  },
  Oc = {
    [yc]: xc,
    ...Dc,
    [Symbol.iterator]() {
      return new _c(this);
    },
    toJSON() {
      return {
        _id: `Effect`,
        op: this[Sc],
        ...z in this ? { args: this[z] } : void 0,
      };
    },
  },
  kc = (e) => bs(e, yc),
  Ac = (e) => bs(e, bc),
  jc = `~effect/Cause`,
  Mc = `~effect/Cause/Reason`,
  Nc = (e) => bs(e, jc),
  Pc = class {
    [jc];
    reasons;
    constructor(e) {
      this[jc] = jc, this.reasons = e;
    }
    pipe() {
      return cs(this, arguments);
    }
    toJSON() {
      return { _id: `Cause`, failures: this.reasons.map((e) => e.toJSON()) };
    }
    toString() {
      return `Cause(${uc(this.reasons)})`;
    }
    [hc]() {
      return this.toJSON();
    }
    [Ls](e) {
      return Nc(e) && this.reasons.length === e.reasons.length &&
        this.reasons.every((t, n) => Rs(t, e.reasons[n]));
    }
    [xs]() {
      return As(this.reasons);
    }
  },
  Fc = new WeakMap(),
  Ic = class {
    [Mc];
    annotations;
    _tag;
    constructor(e, t, n) {
      if (
        this[Mc] = Mc,
          this._tag = e,
          t !== Lc && typeof n == `object` && n && t.size > 0
      ) {
        let e = Fc.get(n);
        e && (t = new Map([...e, ...t])), Fc.set(n, t);
      }
      this.annotations = t;
    }
    annotate(e, t) {
      if (e.mapUnsafe.size === 0) return this;
      let n = new Map(this.annotations);
      e.mapUnsafe.forEach((e, r) => {
        t?.overwrite !== !0 && n.has(r) || n.set(r, e);
      });
      let r = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      return r.annotations = n, r;
    }
    pipe() {
      return cs(this, arguments);
    }
    toString() {
      return uc(this);
    }
    [hc]() {
      return this.toString();
    }
  },
  Lc = new Map(),
  Rc = class extends Ic {
    error;
    constructor(e, t = Lc) {
      super(`Fail`, t, e), this.error = e;
    }
    toString() {
      return `Fail(${uc(this.error)})`;
    }
    toJSON() {
      return { _tag: `Fail`, error: this.error };
    }
    [Ls](e) {
      return Wc(e) && Rs(this.error, e.error) &&
        Rs(this.annotations, e.annotations);
    }
    [xs]() {
      return Cs(R(this._tag))(Cs(L(this.error))(L(this.annotations)));
    }
  },
  zc = (e) => new Pc(e),
  Bc = (e) => new Pc([new Rc(e)]),
  Vc = class extends Ic {
    defect;
    constructor(e, t = Lc) {
      super(`Die`, t, e), this.defect = e;
    }
    toString() {
      return `Die(${uc(this.defect)})`;
    }
    toJSON() {
      return { _tag: `Die`, defect: this.defect };
    }
    [Ls](e) {
      return Gc(e) && Rs(this.defect, e.defect) &&
        Rs(this.annotations, e.annotations);
    }
    [xs]() {
      return Cs(R(this._tag))(Cs(L(this.defect))(L(this.annotations)));
    }
  },
  Hc = (e) => new Pc([new Vc(e)]),
  Uc = F(
    (e) => Nc(e[0]),
    (e, t, n) =>
      t.mapUnsafe.size === 0
        ? e
        : new Pc(e.reasons.map((e) => e.annotate(t, n))),
  ),
  Wc = (e) => e._tag === `Fail`,
  Gc = (e) => e._tag === `Die`,
  Kc = (e) => e._tag === `Interrupt`;
function qc(e) {
  return nl(`Effect.evaluate: Not implemented`);
}
var Jc = (e) => ({
    ...Oc,
    [Sc]: e.op,
    [B]: e[B] ?? qc,
    [Cc]: e[Cc],
    [wc]: e[wc],
    [Tc]: e[Tc],
  }),
  Yc = (e) => {
    let t = Jc(e);
    return function () {
      let n = Object.create(t);
      return n[z] = e.single === !1 ? arguments : arguments[0], n;
    };
  },
  Xc = (e) => {
    let t = {
      [bc]: bc,
      _tag: e.op,
      get [e.prop]() {
        return this[z];
      },
      ...Jc(e),
      toString() {
        return `${e.op}(${uc(this[z])})`;
      },
      toJSON() {
        return { _id: `Exit`, _tag: e.op, [e.prop]: this[z] };
      },
      [Ls](e) {
        return Ac(e) && e._tag === this._tag && Rs(this[z], e[z]);
      },
      [xs]() {
        return Cs(R(e.op), L(this[z]));
      },
    };
    return function (e) {
      let n = Object.create(t);
      return n[z] = e, n;
    };
  },
  Zc = Xc({
    op: `Success`,
    prop: `value`,
    [B](e) {
      let t = e.getCont(Cc);
      return t ? t[Cc](this[z], e, this) : e.yieldWith(this);
    },
  }),
  Qc = { key: `effect/Cause/StackTrace` },
  $c = { key: `effect/Cause/InterruptorStackTrace` },
  el = Xc({
    op: `Failure`,
    prop: `cause`,
    [B](e) {
      let t = this[z], n = !1;
      e.currentStackFrame &&
        (t = Uc(t, { mapUnsafe: new Map([[Qc.key, e.currentStackFrame]]) }),
          n = !0);
      let r = e.getCont(wc);
      for (; e.interruptible && e._interruptedCause && r;) r = e.getCont(wc);
      return r ? r[wc](t, e, n ? void 0 : this) : e.yieldWith(n ? el(t) : this);
    },
  }),
  tl = (e) => el(Bc(e)),
  nl = (e) => el(Hc(e)),
  V = Yc({
    op: `WithFiber`,
    [B](e) {
      return this[z](e);
    },
  }),
  rl = function () {
    class e extends globalThis.Error {}
    let t = Jc({
      op: `YieldableError`,
      [B]() {
        return tl(this);
      },
    });
    return delete t.toString, Object.assign(e.prototype, t), e;
  }(),
  il = function () {
    let e = Symbol.for(`effect/Data/Error/plainArgs`);
    return class extends rl {
      constructor(t) {
        super(t?.message, t?.cause ? { cause: t.cause } : void 0),
          t &&
          (nc(this, t),
            Object.defineProperty(this, e, { value: t, enumerable: !1 }));
      }
      toJSON() {
        return { ...this[e], ...this };
      }
    };
  }(),
  al = (e) => {
    class t extends il {
      _tag = e;
    }
    return t.prototype.name = e, t;
  },
  ol = `~effect/Cause/NoSuchElementError`,
  sl = class extends al(`NoSuchElementError`) {
    [ol] = ol;
    constructor(e) {
      super({ message: e });
    }
  },
  cl = `~effect/Cause/Done`,
  ll = (e) => bs(e, cl),
  ul = { [cl]: cl, _tag: `Done`, value: void 0 },
  dl = (e) => e === void 0 ? ul : { [cl]: cl, _tag: `Done`, value: e },
  fl = tl(ul),
  pl = (e) => e === void 0 ? fl : tl(dl(e)),
  ml = `~effect/data/Option`,
  hl = {
    [ml]: { _A: (e) => e },
    ...Dc,
    [Symbol.iterator]() {
      return new _c(this);
    },
  },
  gl = Object.defineProperty(
    Object.assign(Object.create(hl), {
      _tag: `Some`,
      _op: `Some`,
      [Ls](e) {
        return yl(e) && xl(e) && Rs(this.value, e.value);
      },
      [xs]() {
        return Cs(L(this._tag))(L(this.value));
      },
      toString() {
        return `some(${uc(this.value)})`;
      },
      toJSON() {
        return { _id: `Option`, _tag: this._tag, value: gc(this.value) };
      },
    }),
    "valueOrUndefined",
    {
      get() {
        return this.value;
      },
    },
  ),
  _l = L(`None`),
  vl = Object.assign(Object.create(hl), {
    _tag: `None`,
    _op: `None`,
    valueOrUndefined: void 0,
    [Ls](e) {
      return yl(e) && bl(e);
    },
    [xs]() {
      return _l;
    },
    toString() {
      return `none()`;
    },
    toJSON() {
      return { _id: `Option`, _tag: this._tag };
    },
  }),
  yl = (e) => bs(e, ml),
  bl = (e) => e._tag === `None`,
  xl = (e) => e._tag === `Some`,
  Sl = Object.create(vl),
  Cl = (e) => {
    let t = Object.create(gl);
    return t.value = e, t;
  },
  wl = `~effect/data/Result`,
  Tl = {
    [wl]: { _A: (e) => e, _E: (e) => e },
    ...Dc,
    [Symbol.iterator]() {
      return new _c(this);
    },
  },
  El = Object.assign(Object.create(Tl), {
    _tag: `Success`,
    _op: `Success`,
    [Ls](e) {
      return Ol(e) && Al(e) && Rs(this.success, e.success);
    },
    [xs]() {
      return Cs(L(this._tag))(L(this.success));
    },
    toString() {
      return `success(${uc(this.success)})`;
    },
    toJSON() {
      return { _id: `Result`, _tag: this._tag, value: gc(this.success) };
    },
  }),
  Dl = Object.assign(Object.create(Tl), {
    _tag: `Failure`,
    _op: `Failure`,
    [Ls](e) {
      return Ol(e) && kl(e) && Rs(this.failure, e.failure);
    },
    [xs]() {
      return Cs(L(this._tag))(L(this.failure));
    },
    toString() {
      return `failure(${uc(this.failure)})`;
    },
    toJSON() {
      return { _id: `Result`, _tag: this._tag, failure: gc(this.failure) };
    },
  }),
  Ol = (e) => bs(e, wl),
  kl = (e) => e._tag === `Failure`,
  Al = (e) => e._tag === `Success`,
  jl = (e) => {
    let t = Object.create(Dl);
    return t.failure = e, t;
  },
  Ml = (e) => {
    let t = Object.create(El);
    return t.success = e, t;
  },
  Nl = () => Sl,
  Pl = Cl,
  Fl = bl,
  Il = xl,
  Ll = F(2, (e, { onNone: t, onSome: n }) => Fl(e) ? t() : n(e.value)),
  Rl = F(2, (e, t) => Fl(e) ? t() : e.value),
  zl = F(2, (e, t) => {
    if (Il(e)) return e.value;
    throw t();
  }),
  Bl = F(2, (e, t) => Fl(e) ? Nl() : Pl(t(e.value))),
  Vl = F(2, (e, t) => Fl(e) ? Nl() : t(e.value)),
  Hl = Ml,
  Ul = jl,
  Wl = kl,
  Gl = globalThis.Array,
  Kl = (e) => Gl.isArray(e) ? e : Gl.from(e),
  ql = F(2, (e, t) => Kl(e).concat(Kl(t)));
Gl.isArray;
var Jl = ec,
  Yl = ec,
  Xl = (e) => e[e.length - 1],
  Zl = (e, t) => {
    let n = L(t), r = e.get(n);
    if (r === void 0) return e.set(n, [t]), !0;
    for (let e of r) if (Rs(e, t)) return !1;
    return r.push(t), !0;
  },
  Ql = F(2, (e, t) => {
    let n = Kl(e), r = Kl(t);
    return Yl(n) ? Yl(r) ? tu(ql(n, r)) : n : r;
  }),
  $l = () => [],
  eu = (e) => [e],
  tu = (e) => {
    let t = Kl(e);
    if (t.length < 2) return [...t];
    let n = new Map(), r = [];
    for (let e of t) Zl(n, e) && r.push(e);
    return r;
  },
  nu = (e) => Jc({ op: e.label, [B]: e.evaluate }),
  ru = `~effect/Context/Service`,
  iu = function () {
    function e() {}
    let t = e;
    Object.setPrototypeOf(t, au);
    let n = (
      e,
      n,
    ) => (t.key = e,
      n?.defaultValue && (t[su] = su, t.defaultValue = n.defaultValue),
      n?.make && (t.make = n.make),
      n?.fiberCached && ou.add(e),
      t);
    return arguments.length > 0 ? n(arguments[0], arguments[1]) : n;
  },
  au = {
    [ru]: ru,
    ...nu({
      label: `Service`,
      evaluate(e) {
        return Zc(ku(e.context, this));
      },
    }),
    toJSON() {
      return { _id: `Service`, key: this.key };
    },
    of(e) {
      return e;
    },
    context(e) {
      return wu(this, e);
    },
    use(e) {
      return V((t) => e(ku(t.context, this)));
    },
    useSync(e) {
      return V((t) => Zc(e(ku(t.context, this))));
    },
  },
  ou = new Set(),
  su = `~effect/Context/Reference`,
  cu = `~effect/Context`,
  lu = 8,
  uu = 8,
  du = (e, t, n, r) => {
    let i = Object.create(vu);
    return i.cacheRoot = e ?? i,
      i.base = t,
      i.overlay = n,
      i.depth = r,
      i._flat = void 0,
      i.baseHits = 0,
      i;
  },
  fu = (e, t) => {
    t && (fu(e, t.parent), e.set(t.key, t.value));
  },
  pu = (e) => {
    if (e._flat) return e._flat;
    if (!e.overlay) return e._flat = e.base;
    let t = new Map(e.base);
    return fu(t, e.overlay), e._flat = t;
  },
  mu = (e, t) => {
    let n = new Map(e.mapUnsafe);
    return t(n), _u(n);
  },
  hu = Symbol(),
  gu = (e, t) => {
    let n = e;
    for (let e = n.overlay; e; e = e.parent) if (e.key === t) return e.value;
    let r = n.base.get(t);
    return r === void 0 && !n.base.has(t)
      ? hu
      : (n.overlay && ++n.baseHits >= uu &&
        (n.base = pu(n), n.overlay = void 0, n.depth = 0),
        r);
  },
  _u = (e) => du(void 0, e, void 0, 0),
  vu = {
    get mapUnsafe() {
      return pu(this);
    },
    ...Dc,
    [cu]: { _Services: (e) => e },
    toJSON() {
      return {
        _id: `Context`,
        services: Array.from(this.mapUnsafe).map(([e, t]) => ({
          key: e,
          value: t,
        })),
      };
    },
    [Ls](e) {
      if (!bu(e)) return !1;
      let t = this.mapUnsafe, n = e.mapUnsafe;
      if (t.size !== n.size) return !1;
      for (let [e, r] of t) if (!n.has(e) || !Rs(r, n.get(e))) return !1;
      return !0;
    },
    [xs]() {
      return Es(this.mapUnsafe.size);
    },
  },
  yu = (e, t) => e.cacheRoot === t.cacheRoot,
  bu = (e) => bs(e, cu),
  xu = (e) => !!e[su],
  Su = () => Cu,
  Cu = _u(new Map()),
  wu = (e, t) => _u(new Map([[e.key, t]])),
  Tu = F(3, (e, t, n) => Eu(e, t.key, n)),
  Eu = (e, t, n) => {
    let r = e, i = ou.has(t) ? void 0 : r.cacheRoot;
    if (r.depth >= lu) {
      let e = new Map(r.mapUnsafe);
      return e.set(t, n), du(i, e, void 0, 0);
    }
    return du(i, r.base, { key: t, value: n, parent: r.overlay }, r.depth + 1);
  },
  Du = F(2, (e, t) => Ou(e, t.key)),
  Ou = (e, t) => {
    let n = gu(e, t);
    return n === hu ? void 0 : n;
  },
  ku = F(2, (e, t) => {
    let n = gu(e, t.key);
    if (n === hu) {
      if (xu(t)) return ju(t);
      throw Mu(t);
    }
    return n;
  }),
  Au = `~effect/Context/defaultValue`,
  ju = (e) => Au in e ? e[Au] : e[Au] = e.defaultValue(),
  Mu = (e) => {
    let t = Error(`Service not found${e.key ? `: ${String(e.key)}` : ``}`);
    if (t.stack) {
      let e = t.stack.split(`
`);
      e.splice(1, 3),
        t.stack = e.join(`
`);
    }
    return t;
  },
  Nu = F(
    2,
    (e, t) =>
      e.mapUnsafe.size === 0
        ? t
        : t.mapUnsafe.size === 0
        ? e
        : mu(e, (e) => t.mapUnsafe.forEach((t, n) => e.set(n, t))),
  ),
  Pu = (...e) => {
    let t = new Map();
    for (let n = 0; n < e.length; n++) {
      e[n].mapUnsafe.forEach((e, n) => {
        t.set(n, e);
      });
    }
    return _u(t);
  },
  Fu = iu,
  Iu = `~effect/time/Duration`,
  Lu = BigInt(0),
  Ru = BigInt(1),
  zu = BigInt(2),
  Bu = BigInt(10),
  Vu = BigInt(1e3),
  Hu = (e) => BigInt(e < 0 ? Math.ceil(e - .5) : Math.floor(e + .5)),
  Uu = (e) => Hu(e * 1e6),
  Wu = (e, t) => {
    let n = e.indexOf(`.`);
    if (n === -1) return BigInt(e) * t;
    let r = e[0] === `-`,
      i = e.slice(n + 1),
      a = Bu ** BigInt(i.length),
      o = (BigInt(e.slice(+!!r, n)) * a + BigInt(i)) * t,
      s = o / a + (o % a * zu >= a ? Ru : Lu);
    return r ? -s : s;
  },
  Gu =
    /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/,
  Ku = (e) => {
    switch (typeof e) {
      case `number`:
        return ad(e);
      case `bigint`:
        return id(e);
      case `string`: {
        if (e === `Infinity`) return nd;
        if (e === `-Infinity`) return rd;
        let t = Gu.exec(e);
        if (!t) break;
        let [n, r, i] = t;
        if (i === `nano` || i === `nanos`) return id(Wu(r, Ru));
        if (i === `micro` || i === `micros`) return id(Wu(r, Vu));
        let a = Number(r);
        switch (i) {
          case `milli`:
          case `millis`:
            return ad(a);
          case `second`:
          case `seconds`:
            return od(a);
          case `minute`:
          case `minutes`:
            return sd(a);
          case `hour`:
          case `hours`:
            return cd(a);
          case `day`:
          case `days`:
            return ld(a);
          case `week`:
          case `weeks`:
            return ud(a);
        }
        break;
      }
      case `object`: {
        if (e === null) break;
        if (Iu in e) return e;
        if (Array.isArray(e)) {
          return e.length !== 2 || !e.every(_s)
            ? qu(e)
            : Number.isNaN(e[0]) || Number.isNaN(e[1])
            ? td
            : e[0] === -1 / 0 || e[1] === -1 / 0
            ? rd
            : e[0] === 1 / 0 || e[1] === 1 / 0
            ? nd
            : Qu(Hu(e[0] * 1e9 + e[1]));
        }
        let t = e, n = 0;
        return t.weeks && (n += t.weeks * 6048e5),
          t.days && (n += t.days * 864e5),
          t.hours && (n += t.hours * 36e5),
          t.minutes && (n += t.minutes * 6e4),
          t.seconds && (n += t.seconds * 1e3),
          t.milliseconds && (n += t.milliseconds),
          !t.microseconds && !t.nanoseconds ? Qu(n) : Qu(
            Hu(n * 1e6 + (t.microseconds ?? 0) * 1e3 + (t.nanoseconds ?? 0)),
          );
      }
    }
    return qu(e);
  },
  qu = (e) => {
    throw Error(`Invalid Input: ${e}`);
  },
  Ju = { _tag: `Millis`, millis: 0 },
  Yu = { _tag: `Infinity` },
  Xu = { _tag: `NegativeInfinity` },
  Zu = {
    [Iu]: Iu,
    [xs]() {
      switch (this.value._tag) {
        case `Millis`: {
          let e = this.value.millis * 1e6;
          return Number.isFinite(e) ? L(Hu(e)) : Es(this.value.millis);
        }
        case `Nanos`:
          return L(this.value.nanos);
        default:
          return Os(this.value);
      }
    },
    [Ls](e) {
      return $u(e) && gd(this, e);
    },
    toString() {
      switch (this.value._tag) {
        case `Infinity`:
          return `Infinity`;
        case `NegativeInfinity`:
          return `-Infinity`;
        case `Nanos`:
          return `${this.value.nanos} nanos`;
        case `Millis`:
          return `${this.value.millis} millis`;
      }
    },
    toJSON() {
      switch (this.value._tag) {
        case `Millis`:
          return { _id: `Duration`, _tag: `Millis`, millis: this.value.millis };
        case `Nanos`:
          return {
            _id: `Duration`,
            _tag: `Nanos`,
            nanos: String(this.value.nanos),
          };
        case `Infinity`:
          return { _id: `Duration`, _tag: `Infinity` };
        case `NegativeInfinity`:
          return { _id: `Duration`, _tag: `NegativeInfinity` };
      }
    },
    [hc]() {
      return this.toJSON();
    },
    pipe() {
      return cs(this, arguments);
    },
  },
  Qu = (e) => {
    let t = Object.create(Zu);
    return t.value = typeof e == `number`
      ? isNaN(e) || e === 0 || Object.is(e, -0)
        ? Ju
        : Number.isFinite(e)
        ? Number.isInteger(e)
          ? { _tag: `Millis`, millis: e }
          : { _tag: `Nanos`, nanos: Uu(e) }
        : e > 0
        ? Yu
        : Xu
      : e === Lu
      ? Ju
      : { _tag: `Nanos`, nanos: e },
      t;
  },
  $u = (e) => bs(e, Iu),
  ed = (e) =>
    e.value._tag !== `Infinity` && e.value._tag !== `NegativeInfinity`,
  td = Qu(0),
  nd = Qu(1 / 0),
  rd = Qu(-1 / 0),
  id = (e) => Qu(e),
  ad = (e) => Qu(e),
  od = (e) => Qu(e * 1e3),
  sd = (e) => Qu(e * 6e4),
  cd = (e) => Qu(e * 36e5),
  ld = (e) => Qu(e * 864e5),
  ud = (e) => Qu(e * 6048e5),
  dd = (e) =>
    pd(Ku(e), {
      onMillis: I,
      onNanos: (e) => Number(e) / 1e6,
      onInfinity: () => 1 / 0,
      onNegativeInfinity: () => -1 / 0,
    }),
  fd = (e) => {
    let t = Ku(e);
    switch (t.value._tag) {
      case `Infinity`:
      case `NegativeInfinity`:
        throw Error(`Cannot convert infinite duration to nanos`);
      case `Nanos`:
        return t.value.nanos;
      case `Millis`:
        return Uu(t.value.millis);
    }
  },
  pd = F(2, (e, t) => {
    switch (e.value._tag) {
      case `Millis`:
        return t.onMillis(e.value.millis);
      case `Nanos`:
        return t.onNanos(e.value.nanos);
      case `Infinity`:
        return t.onInfinity();
      case `NegativeInfinity`:
        return (t.onNegativeInfinity ?? t.onInfinity)();
    }
  }),
  md = F(
    3,
    (e, t, n) =>
      e.value._tag === `Infinity` || e.value._tag === `NegativeInfinity` ||
        t.value._tag === `Infinity` || t.value._tag === `NegativeInfinity`
        ? n.onInfinity(e, t)
        : e.value._tag === `Millis`
        ? t.value._tag === `Millis`
          ? n.onMillis(e.value.millis, t.value.millis)
          : n.onNanos(fd(e), t.value.nanos)
        : n.onNanos(e.value.nanos, fd(t)),
  ),
  hd = (e, t) =>
    md(e, t, {
      onMillis: (e, t) => e === t,
      onNanos: (e, t) => e === t,
      onInfinity: (e, t) => e.value._tag === t.value._tag,
    }),
  gd = F(2, (e, t) => hd(e, t)),
  _d = Fu(`effect/Scheduler`, {
    fiberCached: !0,
    defaultValue: () => new xd(),
  }),
  vd = `setImmediate` in globalThis
    ? (e) => {
      let t = globalThis.setImmediate(e);
      return () => globalThis.clearImmediate(t);
    }
    : (e) => {
      let t = setTimeout(e, 0);
      return () => clearTimeout(t);
    },
  yd = (e) => {
    let t = !1;
    return Promise.resolve().then(() => {
      t || e();
    }),
      () => {
        t = !0;
      };
  },
  bd = class {
    buckets = [];
    scheduleTask(e, t) {
      let n = this.buckets, r = n.length, i, a = 0;
      for (; a < r && !(n[a][0] > t); a++) i = n[a];
      i && i[0] === t
        ? i[1].push(e)
        : a === r
        ? n.push([t, [e]])
        : n.splice(a, 0, [t, [e]]);
    }
    drain() {
      let e = this.buckets;
      return this.buckets = [], e;
    }
  },
  xd = class {
    executionMode;
    setImmediate;
    constructor(e = `async`, t) {
      this.executionMode = e, this.setImmediate = t ?? (e === `sync` ? yd : vd);
    }
    shouldYield(e) {
      return e.currentOpCount >= e.maxOpsBeforeYield;
    }
    makeDispatcher() {
      return new Sd(this.setImmediate);
    }
  },
  Sd = class {
    tasks = new bd();
    running = void 0;
    setImmediate;
    constructor(e = vd) {
      this.setImmediate = e;
    }
    scheduleTask(e, t) {
      this.tasks.scheduleTask(e, t),
        this.running === void 0 &&
        (this.running = this.setImmediate(this.afterScheduled));
    }
    afterScheduled = () => {
      this.running = void 0, this.runTasks();
    };
    runTasks() {
      let e = this.tasks.drain();
      for (let t = 0; t < e.length; t++) {
        let n = e[t][1];
        for (let e = 0; e < n.length; e++) n[e]();
      }
    }
    flush() {
      for (; this.tasks.buckets.length > 0;) {
        this.running !== void 0 && (this.running(), this.running = void 0),
          this.runTasks();
      }
    }
  },
  Cd = Fu(`effect/Scheduler/MaxOpsBeforeYield`, {
    fiberCached: !0,
    defaultValue: () => 2048,
  }),
  wd = Fu(`effect/Scheduler/PreventSchedulerYield`, {
    fiberCached: !0,
    defaultValue: () => !1,
  }),
  Td = al,
  Ed = `effect/Tracer/ParentSpan`,
  Dd = `effect/Tracer`,
  Od = `effect/observability/Metric/FiberRuntimeMetricsKey`,
  kd = Fu(`effect/References/CurrentStackFrame`, {
    fiberCached: !0,
    defaultValue: ds,
  }),
  Ad = Fu(`effect/References/CurrentLogLevel`, {
    fiberCached: !0,
    defaultValue: () => `Info`,
  }),
  jd = Fu(`effect/References/MinimumLogLevel`, {
    fiberCached: !0,
    defaultValue: () => `Info`,
  }),
  Md = class extends Ic {
    fiberId;
    constructor(e, t = Lc) {
      super(`Interrupt`, t, `Interrupted`), this.fiberId = e;
    }
    toString() {
      return `Interrupt(${this.fiberId})`;
    }
    toJSON() {
      return { _tag: `Interrupt`, fiberId: this.fiberId };
    }
    [Ls](e) {
      return Kc(e) && this.fiberId === e.fiberId &&
        this.annotations === e.annotations;
    }
    [xs]() {
      return Cs(R(`${this._tag}:${this.fiberId}`))(Ss(this.annotations));
    }
  },
  Nd = (e) => new Pc([new Md(e)]),
  Pd = (e) => {
    for (let t = 0; t < e.reasons.length; t++) {
      let n = e.reasons[t];
      if (n._tag === `Fail`) return Hl(n.error);
    }
    return Ul(e);
  },
  Fd = (e) => e.reasons.some(Kc),
  Id = (e) => {
    let t;
    for (let n = 0; n < e.reasons.length; n++) {
      let r = e.reasons[n];
      r._tag === `Interrupt` &&
        (t ??= new Set(), r.fiberId !== void 0 && t.add(r.fiberId));
    }
    return t ? Hl(t) : Ul(e);
  },
  Ld = F(2, (e, t) => {
    if (e.reasons.length === 0) return t;
    if (t.reasons.length === 0) return e;
    let n = new Pc(Ql(e.reasons, t.reasons));
    return Rs(e, n) ? e : n;
  }),
  Rd = (e) => {
    let t = { Fail: [], Die: [], Interrupt: [] };
    for (let n = 0; n < e.reasons.length; n++) {
      t[e.reasons[n]._tag].push(e.reasons[n]);
    }
    return t;
  },
  zd = (e) => {
    let t = Rd(e);
    return t.Fail.length > 0
      ? t.Fail[0].error
      : t.Die.length > 0
      ? t.Die[0].defect
      : t.Interrupt.length > 0
      ? new globalThis.Error(`All fibers interrupted without error`)
      : new globalThis.Error(`Empty cause`);
  },
  Bd = `~effect/Fiber`,
  Vd = { _A: I, _E: I },
  Hd = { id: 0 },
  Ud = () => globalThis[sc],
  Wd = class {
    constructor(e, t = !0) {
      this[Bd] = Vd,
        this.setContext(e),
        this.id = ++Hd.id,
        this.currentOpCount = 0,
        this.interruptible = t,
        this._stack = [],
        this._observers = [],
        this._exit = void 0,
        this._children = void 0,
        this._interruptedCause = void 0,
        this._yielded = void 0,
        this._running = !1,
        this._deferredInterrupt = !1,
        this.runtimeMetrics?.recordFiberStart(this.context);
    }
    [Bd];
    id;
    interruptible;
    currentOpCount;
    _stack;
    _observers;
    _exit;
    _children;
    _interruptedCause;
    _yielded;
    _running;
    _deferredInterrupt;
    context;
    currentScheduler;
    currentTracerContext;
    currentSpan;
    currentLogLevel;
    minimumLogLevel;
    currentStackFrame;
    runtimeMetrics;
    maxOpsBeforeYield;
    currentPreventYield;
    _dispatcher = void 0;
    get currentDispatcher() {
      return this._dispatcher ??= this.currentScheduler.makeDispatcher();
    }
    getRef(e) {
      return ku(this.context, e);
    }
    addObserver(e) {
      return this._exit
        ? (e(this._exit), fs)
        : (this._observers.push(e), () => {
          if (this._exit) return;
          let t = this._observers.indexOf(e);
          t >= 0 && this._observers.splice(t, 1);
        });
    }
    interruptUnsafe(e, t) {
      if (this._exit) return;
      let n = Nd(e);
      this.currentStackFrame && (n = Uc(n, wu(Qc, this.currentStackFrame))),
        t && (n = Uc(n, t)),
        this._interruptedCause = this._interruptedCause
          ? Ld(this._interruptedCause, n)
          : n,
        this.interruptible &&
        (this._running
          ? this._deferredInterrupt = !0
          : this.evaluate(tf(this._interruptedCause)));
    }
    pollUnsafe() {
      return this._exit;
    }
    evaluate(e) {
      if (this._exit) return;
      if (this._yielded !== void 0) {
        let e = this._yielded;
        this._yielded = void 0, e();
      }
      let t = this.runLoop(e);
      if (t === Ec) return;
      let n = Kd.interruptChildren && Kd.interruptChildren(this);
      if (n !== void 0) return this.evaluate(W(n, () => t));
      this._exit = t,
        this.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
      for (let e = 0; e < this._observers.length; e++) this._observers[e](t);
      this._observers.length = 0,
        this._stack.length = 0,
        this._children = void 0,
        this.context = Su();
    }
    runLoop(e) {
      let t = globalThis[sc];
      globalThis[sc] = this;
      let n = this._running;
      this._running = !0;
      let r = !1, i = e;
      this.currentOpCount = 0;
      try {
        for (;;) {
          if (
            this._deferredInterrupt &&
            (this._deferredInterrupt = !1, i = tf(this._interruptedCause)),
              this.currentOpCount++,
              !r && !this.currentPreventYield &&
              this.currentScheduler.shouldYield(this)
          ) {
            r = !0;
            let e = i;
            i = W(af, () => e);
          }
          if (
            i = this.currentTracerContext
              ? this.currentTracerContext(i, this)
              : i[B](this), i === Ec
          ) {
            let e = this._yielded;
            if (bc in e) {
              return this._deferredInterrupt = !1, this._yielded = void 0, e;
            }
            if (this._deferredInterrupt) {
              this._yielded = void 0, e();
              continue;
            }
            return Ec;
          }
        }
      } catch (e) {
        return bs(i, B)
          ? this.runLoop(nl(e))
          : nl(`Fiber.runLoop: Not a valid effect: ${String(i)}`);
      } finally {
        this._running = n, globalThis[sc] = t;
      }
    }
    getCont(e) {
      if (this._deferredInterrupt) return this._deferredInterrupt = !1, Gd;
      for (;;) {
        let t = this._stack.pop();
        if (!t) return;
        let n = t[Tc] && t[Tc](this);
        if (n) return n[e] = n, n;
        if (t[e]) return t;
      }
    }
    yieldWith(e) {
      return this._yielded = e, Ec;
    }
    children() {
      return this._children ??= new Set();
    }
    pipe() {
      return cs(this, arguments);
    }
    setContext(e) {
      let t = this.context;
      if (this.context = e, t !== void 0 && yu(t, e)) return;
      let n = this.getRef(_d);
      n !== this.currentScheduler &&
      (this.currentScheduler = n, this._dispatcher = void 0),
        this.currentSpan = Ou(e, Ed),
        this.currentLogLevel = this.getRef(Ad),
        this.minimumLogLevel = this.getRef(jd),
        this.currentStackFrame = this.getRef(kd),
        this.maxOpsBeforeYield = this.getRef(Cd),
        this.currentPreventYield = this.getRef(wd),
        this.runtimeMetrics = Ou(e, Od);
      let r = Ou(e, Dd);
      this.currentTracerContext = r ? r.context : void 0;
    }
    get currentSpanLocal() {
      return this.currentSpan?._tag === `Span` ? this.currentSpan : void 0;
    }
  },
  Gd = {
    [Cc](e, t) {
      return tf(t._interruptedCause);
    },
    [wc](e, t) {
      return tf(t._interruptedCause);
    },
  },
  Kd = { interruptChildren: void 0 },
  qd = (e) => {
    if (!e.currentStackFrame) return;
    let t = new Map();
    return t.set($c.key, e.currentStackFrame), _u(t);
  },
  Jd = (e) => {
    let t = e;
    return t._exit
      ? H(t._exit)
      : pf((n) => t._exit ? n(H(t._exit)) : rf(e.addObserver((e) => n(H(e)))));
  },
  Yd = (e) =>
    pf((t) => {
      let n = e[Symbol.iterator](), r = [], i;
      function a() {
        let e = n.next();
        for (; !e.done;) {
          if (e.value._exit) {
            r.push(e.value._exit), e = n.next();
            continue;
          }
          i = e.value.addObserver((e) => {
            r.push(e), a();
          });
          return;
        }
        t(H(r));
      }
      return a(), rf(() => i?.());
    }),
  Xd = (e) => {
    let t = e;
    return t._exit
      ? t._exit
      : pf((n) => t._exit ? n(t._exit) : rf(e.addObserver(n)));
  },
  Zd = (e) =>
    pf((t) => {
      let n = Array.from(e);
      if (n.length === 0) return t(H($l()));
      let r = Array(n.length), i = $l(), a = 0, o = !1;
      for (let e = 0; e < n.length && !o; e++) {
        i.push(n[e].addObserver((s) => {
          if (a++, s._tag === `Failure`) {
            return o = !0, i.forEach((e) => e()), t(s);
          }
          r[e] = s.value, a === n.length && t(H(r));
        }));
      }
      return rf(() => {
        o = !0, i.forEach((e) => e());
      });
    }),
  Qd = (e) => V((t) => $d(e, t.id)),
  $d = F((e) => bs(e[0], Bd), (e, t, n) =>
    V((r) => {
      let i = qd(r);
      return i = i && n ? Nu(i, n) : i ?? n, e.interruptUnsafe(t, i), Cf(Jd(e));
    })),
  ef = (e) =>
    V((t) => {
      let n = qd(t), r = $l();
      for (let i of e) i.interruptUnsafe(t.id, n), r.push(i);
      return Cf(Yd(r));
    }),
  H = Zc,
  tf = el,
  nf = tl,
  rf = Yc({
    op: `Sync`,
    [B](e) {
      let t = this[z](), n = e.getCont(Cc);
      return n ? n[Cc](t, e) : e.yieldWith(Zc(t));
    },
  }),
  U = Yc({
    op: `Suspend`,
    [B](e) {
      return this[z]();
    },
  }),
  af = Yc({
    op: `Yield`,
    [B](e) {
      let t = !1;
      return e.currentDispatcher.scheduleTask(() => {
        t || e.evaluate(Nf);
      }, this[z] ?? 0),
        e.yieldWith(() => {
          t = !0;
        });
    },
  })(0),
  of = H(Nl()),
  sf = (e) => nl(e),
  cf = H(void 0),
  lf = (e) =>
    df(function (t, n) {
      vc(() => e(n)).then((e) => t(H(e)), (e) => t(sf(e)));
    }, e.length !== 0),
  uf = (e) => V((t) => e(t.id)),
  df = Yc({
    op: `Async`,
    single: !1,
    [B](e) {
      let t = vc(() => this[z][0].bind(e.currentScheduler)),
        n = !1,
        r = !1,
        i = this[z][1] ? new AbortController() : void 0,
        a = t((t) => {
          n || (n = !0, r ? e.evaluate(t) : r = t);
        }, i?.signal);
      return r === !1
        ? (r = !0,
          e._yielded = () => {
            n = !0;
          },
          i === void 0 && a === void 0 ||
          e._stack.push(ff(() => (n = !0, i?.abort(), a ?? Nf))),
          Ec)
        : r;
    },
  }),
  ff = Yc({
    op: `AsyncFinalizer`,
    [Tc](e) {
      e.interruptible && (e.interruptible = !1, e._stack.push(Ap));
    },
    [wc](e, t) {
      return Fd(e) ? W(this[z](), () => tf(e)) : tf(e);
    },
  }),
  pf = (e) => df(e, e.length >= 2),
  mf = pf(fs),
  hf = (...e) => U(() => vf(e.length === 1 ? e[0]() : e[1].call(e[0].self))),
  gf = (e, ...t) => {
    let n = t.length === 0
      ? function () {
        return U(() => vf(e.apply(this, arguments)));
      }
      : function () {
        let n = U(() => vf(e.apply(this, arguments)));
        for (let e = 0; e < t.length; e++) n = t[e](n, ...arguments);
        return n;
      };
    return _f(e.length, n);
  },
  _f = (e, t) =>
    Object.defineProperty(t, "length", { value: e, configurable: !0 }),
  vf = Yc({
    op: `Iterator`,
    single: !1,
    [Cc](e, t) {
      let n = this[z][0];
      for (;;) {
        let r = n.next(e);
        if (r.done) return H(r.value);
        if (!Df(r.value)) return t._stack.push(this), r.value;
        if (r.value._tag === `Failure`) return r.value;
        e = r.value.value;
      }
    },
    [B](e) {
      return this[Cc](this[z][1], e);
    },
  }),
  yf = F(2, (e, t) => {
    let n = H(t);
    return W(e, (e) => n);
  }),
  bf = (e) => kf(e, Pl),
  xf = F(2, (e, t) => W(e, (e) => kc(t) ? t : vc(() => t(e)))),
  Sf = F(2, (e, t) => W(e, (e) => yf(kc(t) ? t : vc(() => t(e)), e))),
  Cf = (e) => W(e, (e) => Nf),
  wf = (e, t) =>
    V((n) =>
      pf((r) => {
        let i = !1,
          a = new Set(),
          o = (e) => {
            i = !0, r(a.size === 0 ? e : W(Op(ef(a)), () => e));
          },
          s = 0;
        for (let r of e) {
          if (i) break;
          let e = s++, c = zp(n, r, !0, !0, !1);
          a.add(c),
            c.addObserver((r) => {
              a.delete(c);
              let s = !i;
              o(r),
                s && t?.onWinner &&
                t.onWinner({ fiber: c, index: e, parentFiber: n });
            });
        }
        return ef(a);
      })
    ),
  Tf = F((e) => kc(e[1]), (e, t, n) => wf([e, t], n)),
  W = F(2, (e, t) => {
    let n = Object.create(Ef);
    return n[z] = e, n[Cc] = t.length === 1 ? t : (e) => t(e), n;
  }),
  Ef = Jc({
    op: `OnSuccess`,
    [B](e) {
      return e._stack.push(this), this[z];
    },
  }),
  Df = (e) => bc in e,
  Of = (e) => W(e, I),
  kf = F(2, (e, t) => W(e, (e) => H(vc(() => t(e))))),
  Af = (e) => el(Nd(e)),
  jf = (e) => e._tag === `Success`,
  Mf = (e) => e._tag === `Failure` ? Hl(e.cause) : Ul(e),
  Nf = Zc(void 0),
  Pf = F(2, (e, t) => jf(e) ? t : e),
  Ff = (e) => {
    let t = [];
    for (let n of e) n._tag === `Failure` && t.push(...n.cause.reasons);
    return t.length === 0 ? Nf : el(zc(t));
  },
  If = F(2, (e, t) =>
    V((n) => {
      let r = n.context, i = t(r);
      return r === i ? e : (n.setContext(i),
        xp(e, () => {
          n.setContext(r);
        }));
    })),
  Lf = () => Rf,
  Rf = V((e) => H(e.context)),
  zf = (e) => V((t) => e(t.context)),
  Bf = F(2, (e, t) => Df(e) ? e : If(e, Nu(t))),
  Vf = function () {
    return arguments.length === 1
      ? F(2, (e, t) => Hf(e, arguments[0], t))
      : F(3, (e, t, n) => Hf(e, t, n)).apply(this, arguments);
  },
  Hf = (e, t, n) => If(e, Tu(t, n)),
  Uf = F(2, (e, t) => W(t, (t) => t ? bf(e) : of)),
  Wf = F(
    (e) => kc(e[0]),
    (e, t) =>
      Fp({
        while: us,
        body: ls(t?.disableYield ? e : W(e, (e) => af)),
        step: fs,
      }),
  ),
  Gf = F(2, (e, t) => {
    let n = Object.create(Kf);
    return n[z] = e, n[wc] = t.length === 1 ? t : (e) => t(e), n;
  }),
  Kf = Jc({
    op: `OnFailure`,
    [B](e) {
      return e._stack.push(this), this[z];
    },
  }),
  qf = F(3, (e, t, n) =>
    Gf(e, (e) => {
      let r = t(e);
      return Wl(r) ? tf(r.failure) : vc(() => n(r.success, e));
    })),
  Jf = F(2, (e, t) => qf(e, Pd, (e) => t(e))),
  Yf = F(3, (e, t, n) =>
    Gf(e, (e) => {
      let r = t(e);
      return Wl(r) ? tf(e) : xf(vc(() => n(r.success, e)), tf(e));
    })),
  Xf = F(2, (e, t) => Yf(e, Pd, (e) => t(e))),
  Zf = F((e) => kc(e[0]), (e, t, n, r) =>
    Gf(e, (e) => {
      let i = Pd(e);
      return Wl(i)
        ? tf(i.failure)
        : t(i.success)
        ? vc(() => n(i.success))
        : r
        ? vc(() => r(i.success))
        : tf(e);
    })),
  Qf = F(2, (e, t) => {
    let n = Object.create($f);
    return n[z] = e,
      n[Cc] = t.onSuccess.length === 1 ? t.onSuccess : (e) => t.onSuccess(e),
      n[wc] = t.onFailure.length === 1 ? t.onFailure : (e) => t.onFailure(e),
      n;
  }),
  $f = Jc({
    op: `OnSuccessAndFailure`,
    [B](e) {
      return e._stack.push(this), this[z];
    },
  }),
  ep = (e) => Df(e) ? Zc(e) : tp(e),
  tp = Yc({
    op: `Exit`,
    [B](e) {
      return e._stack.push(this), this[z];
    },
    [Cc](e, t, n) {
      return H(n ?? Zc(e));
    },
    [wc](e, t, n) {
      return H(n ?? el(e));
    },
  }),
  np = F(2, (e, t) => Tf(e, W(sm(t.duration), t.orElse))),
  rp = F(2, (e, t) => np(e, { duration: t, orElse: () => nf(new lm()) })),
  ip = `~effect/Scope`,
  ap = `~effect/Scope/Closeable`,
  op = iu(`effect/Scope`),
  sp = (e, t) => U(() => cp(e, t) ?? cf),
  cp = (e, t) => {
    if (e.state._tag === `Closed`) return;
    let n = { _tag: `Closed`, exit: t };
    if (e.state._tag === `Empty`) {
      e.state = n;
      return;
    }
    let r = e.state;
    if (e.state = n, r.finalizer !== void 0) return r.finalizer(t);
    let i = r.finalizers;
    if (i !== void 0 && i.size !== 0) {
      return i.size === 1 ? i.values().next().value(t) : up(e, i, t);
    }
  },
  lp = (e, t) => jf(e) ? t : Gf(t, (t) => tf(Ld(e.cause, t))),
  up = gf(function* (e, t, n) {
    let r = [], i = [], a = Array.from(t.values()), o = Ud();
    for (let t = a.length - 1; t >= 0; t--) {
      let s = a[t];
      e.strategy === `sequential`
        ? r.push(yield* ep(s(n)))
        : i.push(zp(o, s(n), !0, !0, `inherit`));
    }
    return i.length > 0 && (r = yield* Yd(i)), yield* Ff(r);
  }),
  dp = (e, t) => {
    let n = gp(t);
    if (e.state._tag === `Closed`) return n.state = e.state, n;
    let r = {};
    return mp(e, r, (e) => sp(n, e)), mp(n, r, (t) => rf(() => hp(e, r))), n;
  },
  fp = (e, t) =>
    U(() => e.state._tag === `Closed` ? t(e.state.exit) : (mp(e, {}, t), cf)),
  pp = (e, t) => fp(e, ls(t)),
  mp = (e, t, n) => {
    if (e.state._tag === `Empty`) {
      e.state = {
        _tag: `Open`,
        finalizerKey: t,
        finalizer: n,
        finalizers: void 0,
      };
    } else if (e.state._tag === `Open`) {
      let r = e.state;
      r.finalizer === void 0
        ? r.finalizers === void 0
          ? (r.finalizerKey = t, r.finalizer = n)
          : r.finalizers.set(t, n)
        : (r.finalizers = new Map([[r.finalizerKey, r.finalizer]]),
          r.finalizerKey = void 0,
          r.finalizer = void 0,
          r.finalizers.set(t, n));
    }
  },
  hp = (e, t) => {
    if (e.state._tag === `Open`) {
      let n = e.state;
      n.finalizerKey === t
        ? (n.finalizerKey = void 0, n.finalizer = void 0)
        : n.finalizers !== void 0 && n.finalizers.delete(t);
    }
  },
  gp = (e = `sequential`) => ({ [ap]: ap, [ip]: ip, strategy: e, state: _p }),
  _p = { _tag: `Empty` },
  vp = op,
  yp = Vf(op),
  bp = (e) =>
    U(() => {
      let t = gp();
      return Sp(e(t), (e) => U(() => cp(t, e) ?? cf));
    }),
  xp = Yc({
    op: `OnExit`,
    single: !1,
    [B](e) {
      return e._stack.push(this), this[z][0];
    },
    [Tc](e) {
      e.interruptible && this[z][2] !== !0 &&
        (e._stack.push(Ap), e.interruptible = !1);
    },
    [Cc](e, t, n) {
      n ??= Zc(e);
      let r = this[z][1](n);
      return r ? W(r, (e) => n) : n;
    },
    [wc](e, t, n) {
      n ??= el(e);
      let r = this[z][1](n);
      return r ? W(lp(n, r), (e) => n) : n;
    },
  }),
  Sp = F(2, xp),
  Cp = F(3, (e, t, n) =>
    Sp(e, (e) => {
      let r = t(e);
      return Wl(r) ? cf : n(r.success, e);
    })),
  wp = F(2, (e, t) => Cp(e, Mf, t)),
  Tp = F(3, (e, t, n) =>
    Sp(e, (e) => {
      if (e._tag !== `Failure`) return cf;
      let r = t(e.cause);
      return Wl(r) ? cf : n(r.success, e.cause);
    })),
  Ep = F(2, (e, t) => Tp(Id, t)(e)),
  Dp = V((e) => tf(Nd(e.id))),
  Op = (e) =>
    V((t) =>
      t.interruptible ? (t.interruptible = !1, t._stack.push(Ap), e) : e
    ),
  kp = Yc({
    op: `SetInterruptible`,
    [Tc](e) {
      if (
        e.interruptible = this[z], e._interruptedCause && e.interruptible
      ) return () => tf(e._interruptedCause);
    },
  }),
  Ap = kp(!0),
  jp = kp(!1),
  Mp = (e) => {
    if (e.interruptible = !0, e._stack.push(jp), e._interruptedCause) {
      return tf(e._interruptedCause);
    }
  },
  Np = (e) => V((t) => t.interruptible ? e : Mp(t) ?? e),
  Pp = (e) =>
    V((t) =>
      t.interruptible ? (t.interruptible = !1, t._stack.push(Ap), e(Np)) : e(I)
    ),
  Fp = Yc({
    op: `While`,
    [Cc](e, t) {
      return this[z].step(e),
        this[z].while() ? (t._stack.push(this), this[z].body()) : Nf;
    },
    [B](e) {
      return this[z].while() ? (e._stack.push(this), this[z].body()) : Nf;
    },
  }),
  Ip = F((e) => typeof e[1] == `function`, (e, t, n) =>
    U(() => {
      let r = n?.concurrency ?? 1,
        i = r === `unbounded` ? 1 / 0 : Math.max(1, r);
      if (i === 1) return Lp(e, t, n);
      let a = Kl(e), o = a.length;
      if (o === 0) return n?.discard ? cf : H([]);
      let s = n?.discard ? void 0 : Array(o),
        c = Rp({ f: t, out: s }, a, { concurrency: i });
      return c ? yf(c, s) : H(s);
    })),
  Lp = (e, t, n) =>
    U(() => {
      let r = n?.discard ? void 0 : [],
        i = e[Symbol.iterator](),
        a = i.next(),
        o = 0;
      return yf(
        Fp({
          while: () => !a.done,
          body: () => t(a.value, o++),
          step: (e) => {
            r && r.push(e), a = i.next();
          },
        }),
        r,
      );
    }),
  Rp = ((e) => {
    let t = e.onItem,
      n = e.step,
      r = (e, i, a, o) => {
        for (; a < o; a++) {
          let s = i[a], c = t(e, s, a);
          if (!Df(c)) {
            return W(ep(c), (t) => n(e, s, t, a) ?? r(e, i, a + 1, o) ?? cf);
          }
          let l = n(e, s, c, a);
          if (l) return l._tag === `Failure` ? l : void 0;
        }
      };
    return (e, i, a) => {
      let o = 0, s = a?.end ?? i.length, c = a?.concurrency ?? 1;
      if (c === 1) return r(e, i, 0, s);
      let l = a?.orderedStep === !0,
        u = !1,
        d,
        f,
        p,
        m = !1,
        h,
        g,
        _ = o,
        v = l ? Array(s) : void 0,
        ee = (e) => {
          let t = nl(e);
          return h = t,
            u = !0,
            m = !0,
            f && f.size > 0 ? W(Op(ef(Array.from(f))), () => t) : t;
        },
        te = (t, r, a) => {
          if (!l) return n(e, t, r, a);
          if (h) return h;
          for (v[a] = r; _ < s;) {
            let t = v[_];
            if (t === void 0) return;
            v[_] = void 0;
            let r = _++, a = n(e, i[r], t, r);
            if (a) return a;
          }
        },
        ne = () => {
          let n = !1;
          for (; !h && o < s; o++) {
            let r = i[o], a = g ?? t(e, r, o);
            if (Df(a)) { if (h = te(r, a, o), h) break; }
            else if (d) {
              g = void 0;
              let e = zp(d, a, !0, !0, `inherit`);
              if (e._exit) {
                if (h = te(r, e._exit, o), h) break;
                continue;
              }
              f.add(e);
              let t = o;
              if (
                e.addObserver((i) => {
                  f.delete(e);
                  try {
                    if (h) {
                      if (!m && i._tag === `Failure`) {
                        for (let e of i.cause.reasons) {
                          if (e._tag === `Interrupt`) continue;
                          else {h._tag === `Failure`
                              ? h.cause.reasons.push(e)
                              : h = el(zc([e]));}
                        }
                      }
                    } else {
                      let e = te(r, i, t);
                      e &&
                        (h = e._tag === `Failure`
                          ? el(zc(e.cause.reasons.slice()))
                          : e,
                          ne());
                    }
                    if (n) {
                      let e = ne();
                      e && p(e);
                    } else u && f.size === 0 && p(h ?? cf);
                  } catch (e) {
                    p(ee(e));
                  }
                }), f.size < c
              ) continue;
              n = !0, o++;
              return;
            } else {return pf((e) => {
                d = Ud(), f = new Set(), g = a, p = e;
                let t;
                try {
                  t = ne();
                } catch (t) {
                  return e(ee(t));
                }
                return t ? e(t) : U(() => (h = Nf, m = !0, f ? ef(f) : cf));
              });}
          }
          if (u = !0, h) {
            if (f && f.size > 0) {
              let e = qd(d);
              f.forEach((t) => t.interruptUnsafe(d.id, e));
              return;
            }
            if (p || h._tag === `Failure`) return h;
          } else if (p) {
            if (f) f.size === 0 && p(cf);
            else return Nf;
          }
        };
      return ne();
    };
  })({
    onItem(e, t, n) {
      return e.f(t, n);
    },
    step(e, t, n, r) {
      if (n._tag === `Failure`) return n;
      e.out && (e.out[r] = n.value);
    },
  }),
  zp = (e, t, n = !1, r = !1, i = !1) => {
    let a = e,
      o = i === `inherit` ? a.interruptible : !i,
      s = new Wd(a.context, o);
    return n
      ? s.evaluate(t)
      : a.currentDispatcher.scheduleTask(() => s.evaluate(t), 0),
      !r && !s._exit &&
      (a.children().add(s), s.addObserver(() => a._children.delete(s))),
      s;
  },
  Bp = F(
    (e) => kc(e[0]),
    (e, t) =>
      V((n) => H(zp(n, e, t?.startImmediately, !0, t?.uninterruptible))),
  ),
  Vp = F((e) => kc(e[0]), (e, t, n) =>
    V((r) => {
      let i = zp(r, e, n?.startImmediately, !0, n?.uninterruptible);
      if (!i._exit) {
        if (t.state._tag !== `Closed`) {
          let e = {};
          mp(t, e, () => uf((e) => e === i.id ? cf : Qd(i))),
            i.addObserver(() => hp(t, e));
        } else i.interruptUnsafe(r.id, qd(r));
      }
      return H(i);
    })),
  Hp = (e) => (t, n) => {
    let r = new Wd(
      n?.scheduler ? Tu(e, _d, n.scheduler) : e,
      n?.uninterruptible !== !0,
    );
    if (r.evaluate(t), r._exit) return r;
    if (n?.signal) {
      if (n.signal.aborted) r.interruptUnsafe();
      else {
        let e = () => r.interruptUnsafe();
        n.signal.addEventListener(`abort`, e, { once: !0 }),
          r.addObserver(() => n.signal.removeEventListener(`abort`, e));
      }
    }
    return n?.onFiberStart && n.onFiberStart(r), r;
  },
  Up = F(2, (e, t) => {
    if (e._exit) return e;
    if (t.state._tag === `Closed`) return e.interruptUnsafe(e.id), e;
    let n = {};
    return mp(t, n, () => Qd(e)), e.addObserver(() => hp(t, n)), e;
  }),
  Wp = (e) => {
    let t = Hp(e);
    return (e, n) => {
      let r = t(e, n);
      return n?.onExit && r.addObserver(n.onExit), (e) => r.interruptUnsafe(e);
    };
  },
  Gp = (e) => {
    let t = Hp(e);
    return (e, n) => {
      let r = t(e, n);
      return new Promise((e) => {
        r.addObserver((t) => e(t));
      });
    };
  },
  Kp = ((e) => {
    let t = Gp(e);
    return (e, n) =>
      t(e, n).then((e) => {
        if (e._tag === `Failure`) throw zd(e.cause);
        return e.value;
      });
  })(Su()),
  qp = (e) => {
    let t = Hp(e);
    return (e) => {
      if (Df(e)) return e;
      let n = new xd(`sync`), r = t(e, { scheduler: n });
      return r._dispatcher?.flush(), r._exit ?? nl(new dm(r));
    };
  },
  Jp = (e) => {
    let t = qp(e);
    return (e) => {
      let n = t(e);
      if (n._tag === `Failure`) throw zd(n.cause);
      return n.value;
    };
  },
  Yp = Jp(Su()),
  Xp = H(!0),
  Zp = H(!1),
  Qp = class {
    waiters = [];
    scheduled = void 0;
    _isOpen;
    constructor(e) {
      this._isOpen = e;
    }
    scheduleUnsafe(e) {
      if (this.waiters.length === 0) return Xp;
      if (this.scheduled === void 0) {
        this.scheduled = this.waiters,
          e.currentDispatcher.scheduleTask(this.flushScheduled, 0);
      } else {for (let e = 0; e < this.waiters.length; e++) {
          this.scheduled.push(this.waiters[e]);
        }}
      return this.waiters = [], Xp;
    }
    flushScheduled = () => {
      if (this.scheduled === void 0) return;
      let e = this.scheduled;
      this.scheduled = void 0;
      for (let t = 0; t < e.length; t++) e[t](Nf);
    };
    flushWaiters() {
      let e = this.waiters;
      this.waiters = [], this.flushScheduled();
      for (let t = 0; t < e.length; t++) e[t](Nf);
    }
    open = V((e) =>
      this._isOpen ? Zp : (this._isOpen = !0, this.scheduleUnsafe(e))
    );
    release = V((e) => this._isOpen ? Zp : this.scheduleUnsafe(e));
    openUnsafe() {
      return !this._isOpen && (this._isOpen = !0, this.flushWaiters(), !0);
    }
    await = pf((e) =>
      this._isOpen ? e(cf) : (this.waiters.push(e),
        rf(() => {
          let t = this.waiters.indexOf(e);
          t === -1
            ? this.scheduled !== void 0 &&
              (t = this.scheduled.indexOf(e),
                t !== -1 && this.scheduled.splice(t, 1))
            : this.waiters.splice(t, 1);
        }))
    );
    closeUnsafe() {
      return this._isOpen ? (this._isOpen = !1, !0) : !1;
    }
    close = rf(() => this.closeUnsafe());
    whenOpen = (e) => W(this.await, () => e);
    isOpen() {
      return this._isOpen;
    }
  },
  $p = (e) => new Qp(e ?? !1),
  em = Fu(`effect/Clock`, { defaultValue: () => new nm() }),
  tm = 2 ** 31 - 1,
  nm = class {
    currentTimeMillisUnsafe() {
      return Date.now();
    }
    currentTimeMillis = rf(() => this.currentTimeMillisUnsafe());
    currentTimeNanosUnsafe() {
      return am();
    }
    currentTimeNanos = rf(() => this.currentTimeNanosUnsafe());
    monotonicTimeNanosUnsafe() {
      return im();
    }
    monotonicTimeNanos = rf(() => this.monotonicTimeNanosUnsafe());
    sleep(e) {
      return this.sleepMillis(dd(e));
    }
    sleepMillis(e) {
      return e <= 0 ? af : Number.isFinite(e)
        ? pf((t) => {
          let n = e > tm ? this.sleepMillis(e - tm) : cf,
            r = setTimeout(() => t(n), Math.min(e, tm));
          return rf(() => clearTimeout(r));
        })
        : mf;
    }
  },
  rm = BigInt(1e6),
  im = function () {
    let e = globalThis.process?.hrtime;
    if (typeof e?.bigint == `function`) return () => e.bigint();
    if (typeof performance < `u` && typeof performance.now == `function`) {
      return () => BigInt(Math.round(performance.now() * 1e6));
    }
    let t = BigInt(0);
    return () => {
      let e = BigInt(Date.now()) * rm;
      return e > t && (t = e), t;
    };
  }(),
  am = function () {
    let e = BigInt(1e9), t;
    return () => {
      let n = im(), r = BigInt(Date.now()) * rm;
      if (t === void 0) t = r - n;
      else {
        let i = t + n;
        (r > i ? r - i : i - r) > e && (t = r - n);
      }
      return t + n;
    };
  }(),
  om = (e) => V((t) => e(t.getRef(em))),
  sm = (e) => om((t) => t.sleep(Ku(e))),
  cm = `~effect/Cause/TimeoutError`,
  lm = class extends al(`TimeoutError`) {
    [cm] = cm;
    constructor(e) {
      super({ message: e });
    }
  },
  um = `~effect/Cause/AsyncFiberError`,
  dm = class extends al(`AsyncFiberError`) {
    [um] = um;
    constructor(e) {
      super({
        message: `An asynchronous Effect was executed with Effect.runSync`,
        fiber: e,
      });
    }
  },
  fm = {
    bold: `1`,
    red: `31`,
    green: `32`,
    yellow: `33`,
    blue: `34`,
    cyan: `36`,
    white: `37`,
    gray: `90`,
    black: `30`,
    bgBrightRed: `101`,
  };
fm.gray, fm.blue, fm.green, fm.yellow, fm.red, fm.bgBrightRed, fm.black;
var pm = zc,
  mm = Bc,
  hm = Nd,
  gm = zd,
  _m = sl,
  vm = ll,
  ym = pl,
  bm = Ac,
  xm = Zc,
  Sm = el,
  Cm = tl,
  wm = Nf,
  Tm = {
    "~effect/Deferred": { _A: I, _E: I },
    pipe() {
      return cs(this, arguments);
    },
  },
  Em = () => {
    let e = Object.create(Tm);
    return e.resumes = void 0, e.effect = void 0, e;
  },
  Dm = (e) =>
    pf((t) =>
      e.effect ? t(e.effect) : (e.resumes ??= [],
        e.resumes.push(t),
        rf(() => {
          let n = e.resumes;
          if (n === void 0) return;
          let r = n.indexOf(t);
          r >= 0 && n.splice(r, 1);
        }))
    ),
  Om = F(2, (e, t) => rf(() => jm(e, t))),
  km = F(2, (e, t) => Om(e, el(t))),
  Am = F(2, (e, t) => km(e, Nd(t))),
  jm = (e, t) => {
    if (e.effect) return !1;
    if (e.effect = t, e.resumes) {
      let n = e.resumes;
      e.resumes = void 0;
      for (let e = 0; e < n.length; e++) n[e](t);
    }
    return !0;
  },
  Mm = op,
  Nm = gp,
  Pm = yp,
  Fm = fp,
  Im = pp,
  Lm = dp,
  Rm = sp,
  zm = `~effect/Layer`,
  Bm = `~effect/Layer/MemoMap`,
  Vm = (e, t) => (e.observers++, xf(fp(t, (t) => e.finalizer(t)), e.effect)),
  Hm = {
    [zm]: { _ROut: I, _E: I, _RIn: I },
    pipe() {
      return cs(this, arguments);
    },
  },
  Um = (e) => {
    let t = Object.create(Hm);
    return t.build = e, t;
  },
  Wm = (e) =>
    Um((t, n) => {
      let r = Lm(n);
      return Sp(e(t, r), (e) => e._tag === `Failure` ? Rm(r, e) : cf);
    }),
  Gm = (e) => {
    let t = Wm((n, r) => n.getOrElseMemoize(t, r, e));
    return t;
  },
  Km = (e, t, n, r) => {
    let i = Nm(),
      a = Em(),
      o = {
        observers: 1,
        effect: Dm(a),
        finalizer: (n) =>
          U(
            () => (o.observers--,
              o.observers === 0 ? (e.map.delete(t), Rm(i, n)) : cf),
          ),
      };
    return e.map.set(t, o),
      fp(n, o.finalizer).pipe(
        W(() => r(e, i)),
        Sp((e) => (o.effect = e, Om(a, e))),
      );
  },
  qm = class {
    get [Bm]() {
      return Bm;
    }
    parent;
    constructor(e) {
      this.parent = e;
    }
    map = new Map();
    get(e, t) {
      let n = this.map.get(e);
      return n ? Vm(n, t) : this.parent?.get(e, t);
    }
    getOrElseMemoize(e, t, n) {
      return U(() => this.get(e, t) || Km(this, e, t, n));
    }
  },
  Jm = () => new qm(),
  Ym = (e) => new qm(e),
  Xm = class e extends iu()(`effect/Layer/CurrentMemoMap`) {
    static forkOrCreate(t) {
      let n = Du(t, e);
      return n ? Ym(n) : Jm();
    }
  },
  Zm = F(3, (e, t, n) => Vf(kf(e.build(t, n), Tu(Xm, t)), Xm, t)),
  Qm = F(2, (e, t) => V((n) => Zm(e, Xm.forkOrCreate(n.context), t))),
  $m = function () {
    return arguments.length === 1
      ? (e) => eh(wu(arguments[0], e))
      : eh(wu(arguments[0], arguments[1]));
  },
  eh = (e) => Um(ls(H(e))),
  th = function () {
    return arguments.length === 1
      ? (e) => nh(arguments[0], e)
      : nh(arguments[0], arguments[1]);
  },
  nh = (e, t) => rh(kf(t, (t) => wu(e, t))),
  rh = (e) => Gm((t, n) => Pm(e, n)),
  ih = (e, t, n) => {
    let r = Lm(n, `parallel`);
    return Ip(e, (e) => e.build(t, Lm(r, `sequential`)), {
      concurrency: e.length,
    }).pipe(kf((e) => Pu(...e)));
  },
  ah = (...e) => Wm((t, n) => ih(e, t, n)),
  oh = (e, t, n) =>
    Wm((r, i) =>
      W(
        Array.isArray(t) ? ih(t, r, i) : t.build(r, i),
        (t) => e.build(r, i).pipe(Bf(t), kf((e) => n(e, t))),
      )
    ),
  sh = F(2, (e, t) => oh(e, t, I)),
  ch = F(2, (e, t) => oh(e, t, (e, t) => Nu(t, e))),
  lh = F(2, (e, t) => qf(e, ph, (e) => t(e))),
  uh = (e) => e.reasons.some(dh),
  dh = (e) => e._tag === `Fail` && vm(e.error),
  fh = (e) => {
    let t, n = !1;
    for (let r of e.reasons) {
      dh(r) ? t ??= r.error : r._tag !== `Interrupt` && (n = !0);
    }
    return t === void 0
      ? Ul(e)
      : n
      ? Ul(pm(e.reasons.filter((e) => !dh(e))))
      : Hl(t);
  },
  ph = (e) => {
    let t = fh(e);
    return Wl(t) ? t : Hl(t.success.value);
  },
  mh = (e) => {
    let t = fh(e);
    return Wl(t) ? Sm(t.failure) : xm(t.success.value);
  },
  hh = F(2, (e, t) =>
    Qf(e, {
      onSuccess: t.onSuccess,
      onFailure: (e) => {
        let n = fh(e);
        return Wl(n) ? t.onFailure(n.failure) : t.onDone(n.success.value);
      },
    })),
  gh = `~effect/Schedule`,
  _h = Fu(`effect/Schedule/CurrentMetadata`, {
    defaultValue: ls({
      input: void 0,
      output: void 0,
      duration: td,
      attempt: 0,
      start: 0,
      now: 0,
      elapsed: 0,
      elapsedSincePrevious: 0,
    }),
  }),
  vh = {
    [gh]: { _Out: I, _In: I, _Env: I },
    pipe() {
      return cs(this, arguments);
    },
  },
  yh = (e) => bs(e, gh),
  bh = (e) => {
    let t = Object.create(vh);
    return t.step = e, t;
  },
  xh = () => {
    let e = 0, t, n;
    return (r, i) => {
      n === void 0 && (n = r);
      let a = r - n, o = t === void 0 ? 0 : r - t;
      return t = r, {
        input: i,
        attempt: ++e,
        start: n,
        now: r,
        elapsed: a,
        elapsedSincePrevious: o,
      };
    };
  },
  Sh = (e) =>
    bh(kf(e, (e) => {
      let t = xh();
      return (n, r) => e(t(n, r));
    })),
  Ch = (e) => Gf(e.step, (e) => H(() => tf(e))),
  wh = (e) =>
    om((t) =>
      kf(Ch(e), (e) => {
        let n = xh();
        return (r) =>
          U(() => {
            let i = t.currentTimeMillisUnsafe();
            return W(e(i, r), ([e, t]) => {
              let a = n(i, r);
              return a.output = e, a.duration = t, yf(sm(t), a);
            });
          });
      })
    ),
  Th = (e, t = 2) => {
    let n = dd(Ku(e));
    return Sh(H((e) => {
      let r = ad(n * t ** (e.attempt - 1));
      return H([r, r]);
    }));
  },
  Eh = (e) =>
    bh(
      kf(Ch(e), (e) => (t, n) =>
        hh(e(t, n), {
          onSuccess: (e) => H([n, e[1]]),
          onFailure: tf,
          onDone: () => ym(n),
        })),
    ),
  Dh = (e) => {
    let t = Ku(e);
    return Sh(H((e) => H([e.attempt - 1, t])));
  },
  Oh = F(2, (e, t) =>
    bh(kf(Ch(e), (e) => {
      let n = xh();
      return (r, i) =>
        W(e(r, i), (e) => {
          let [a, o] = e, s = t({ ...n(r, i), output: a, duration: o });
          return W(kc(s) ? s : H(s), (t) => t ? H(e) : ym(a));
        });
    }))),
  kh = Dh(td),
  Ah = (e, t, n) =>
    bp((r) => W(n?.local ? Zm(t, Jm(), r) : Qm(t, r), (t) => Bf(e, t))),
  jh = F(
    (e) => kc(e[0]),
    (e, t, n) => bu(t) ? Bf(e, t) : Ah(e, Array.isArray(t) ? ah(...t) : t, n),
  ),
  Mh = F(3, (e, t, n) =>
    W(wh(t), (t) => {
      let r = _h.defaultValue(),
        i,
        a = Jf(
          U(() => Vf(e, _h, r)),
          (e) => (i = e, W(t(e), (e) => (r = e, a))),
        );
      return lh(a, (e) => vc(() => n(i, e)));
    })),
  Nh = F(
    2,
    (e, t) => Mh(e, typeof t == `function` ? t(I) : yh(t) ? t : Fh(t), nf),
  ),
  Ph = Eh(kh),
  Fh = (e) => {
    let t = e.schedule ? Eh(e.schedule) : Ph;
    return e.while && (t = Oh(t, ({ input: t }) => {
      let n = e.while(t);
      return kc(n) ? n : H(n);
    })),
      e.until && (t = Oh(t, ({ input: t }) => {
        let n = e.until(t);
        return kc(n) ? kf(n, (e) => !e) : H(!n);
      })),
      e.times !== void 0 && (t = Oh(t, ({ attempt: t }) => H(t <= e.times))),
      t;
  },
  Ih = kc,
  Lh = Ip,
  Rh = Fp,
  zh = lf,
  G = H,
  Bh = U,
  K = rf,
  Vh = cf,
  Hh = pf,
  Uh = mf,
  Wh = hf,
  Gh = nf,
  Kh = tf,
  qh = V,
  Jh = W,
  Yh = Of,
  Xh = xf,
  Zh = Sf,
  Qh = kf,
  $h = yf,
  eg = Cf,
  tg = Gf,
  ng = Zf,
  rg = Xf,
  ig = Nh,
  ag = rp,
  og = sm,
  sg = Uf,
  cg = Qf,
  lg = Lf,
  ug = zf,
  dg = jh,
  fg = Bf,
  pg = Vf,
  mg = vp,
  hg = bp,
  gg = wp,
  _g = Sp,
  vg = Dp,
  yg = Ep,
  bg = Op,
  xg = Wf,
  Sg = Vp,
  Cg = Bp,
  wg = Hp,
  Tg = Wp,
  Eg = Kp,
  Dg = Yp,
  Og = Jp,
  kg = gf,
  Ag = Xd,
  jg = Zd,
  Mg = Ud,
  Ng = Up,
  Pg = $p,
  Fg = `~effect/MutableRef`,
  Ig = {
    [Fg]: Fg,
    ...Dc,
    toJSON() {
      return { _id: `MutableRef`, current: gc(this.current) };
    },
  },
  Lg = (e) => {
    let t = Object.create(Ig);
    return t.current = e, t;
  },
  Rg = F(2, (e, t) => (e.current = t, e)),
  zg = Symbol.for(`effect/MutableList/Empty`),
  Bg = () => ({ head: void 0, tail: void 0, length: 0 }),
  Vg = () => ({ array: [], mutable: !0, offset: 0, next: void 0 }),
  Hg = (e, t) => {
    e.tail
      ? e.tail.mutable || (e.tail.next = Vg(), e.tail = e.tail.next)
      : e.head = e.tail = Vg(),
      e.tail.array.push(t),
      e.length++;
  },
  Ug = (e) => {
    e.head = e.tail = void 0, e.length = 0;
  },
  Wg = (e, t) => {
    if (t <= 0 || !e.head) return [];
    if (
      t = Math.min(t, e.length),
        t === e.length && e.head?.offset === 0 && !e.head.next
    ) {
      let t = e.head.array;
      return Ug(e), t;
    }
    let n = Array(t), r = 0, i = e.head;
    for (; i;) {
      for (; i.offset < i.array.length;) {
        if (
          n[r++] = i.array[i.offset],
            i.mutable && (i.array[i.offset] = void 0),
            i.offset++,
            r === t
        ) return e.head = i, e.length -= t, e.length === 0 && Ug(e), n;
      }
      i = i.next;
    }
    return Ug(e), n;
  },
  Gg = (e) => Wg(e, e.length),
  Kg = (e) => {
    if (!e.head) return zg;
    let t = e.head.array[e.head.offset];
    return e.head.mutable && (e.head.array[e.head.offset] = void 0),
      e.head.offset++,
      e.length--,
      e.head.offset === e.head.array.length &&
      (e.head.next ? e.head = e.head.next : Ug(e)),
      t;
  },
  qg = (e, t) => {
    let n = [], r = e.head;
    for (; r;) {
      for (let e = r.offset; e < r.array.length; e++) {
        t(r.array[e], e) && n.push(r.array[e]);
      }
      r = r.next;
    }
    if (n.length === 0) {
      Ug(e);
      return;
    }
    e.head = e.tail = { array: n, mutable: !0, offset: 0, next: void 0 },
      e.length = n.length;
  },
  Jg = (e, t) => qg(e, (e) => e !== t),
  Yg = `~effect/PubSub/Subscription`,
  Xg = F(
    2,
    (e, t) =>
      e.shutdownFlag.current
        ? !1
        : e.pubsub.publish(t)
        ? (e.strategy.completeSubscribersUnsafe(e.pubsub, e.subscribers), !0)
        : !1,
  ),
  Zg = (e) =>
    bg(ug((t) => {
      let n = ku(t, Mm),
        r = Lm(e.scope),
        i = t_(e.pubsub, e.subscribers, e.strategy);
      return Im(r, Qg(i)).pipe(Xh(Fm(n, (e) => Rm(r, e))), $h(i));
    })),
  Qg = (e) =>
    bg(
      qh((t) => (Rg(e.shutdownFlag, !0),
        Lh(Gg(e.pollers), (e) => Am(e, t.id), {
          discard: !0,
          concurrency: `unbounded`,
        }).pipe(
          Zh(() =>
            K(() => {
              e.subscribers.delete(e.subscription),
                e.subscription.unsubscribe(),
                e.replayWindow.close(),
                e.strategy.onPubSubEmptySpaceUnsafe(e.pubsub, e.subscribers);
            })
          ),
          sg(e.shutdownHook.open),
          eg,
        ))
      ),
    ),
  $g = (e) =>
    Bh(function t(n) {
      if (e.shutdownFlag.current) return vg;
      let r = e.pollers.length === 0 ? e.subscription.pollUpTo(1 / 0) : [];
      return n && (r = n.concat(r)),
        e.strategy.onPubSubEmptySpaceUnsafe(e.pubsub, e.subscribers),
        e.replayWindow.remaining > 0
          ? G(e.replayWindow.takeAll().concat(r))
          : Jl(r)
          ? G(r)
          : Jh(e_(e), (e) => t([e]));
    }),
  e_ = (e) => {
    let t = Em(), n = e.subscribers.get(e.subscription);
    return n || (n = new Set(), e.subscribers.set(e.subscription, n)),
      n.add(e.pollers),
      Hg(e.pollers, t),
      e.strategy.completePollersUnsafe(
        e.pubsub,
        e.subscribers,
        e.subscription,
        e.pollers,
      ),
      yg(Dm(t), () => (Jg(e.pollers, t), Vh));
  },
  t_ = (e, t, n) =>
    new n_(e, t, e.subscribe(), Bg(), Pg(!1), Lg(!1), n, e.replayWindow()),
  n_ = class {
    [Yg] = { _A: I };
    pubsub;
    subscribers;
    subscription;
    pollers;
    shutdownHook;
    shutdownFlag;
    strategy;
    replayWindow;
    constructor(e, t, n, r, i, a, o, s) {
      this.pubsub = e,
        this.subscribers = t,
        this.subscription = n,
        this.pollers = r,
        this.shutdownHook = i,
        this.shutdownFlag = a,
        this.strategy = o,
        this.replayWindow = s;
    }
    pipe() {
      return cs(this, arguments);
    }
  },
  r_ = `~effect/Queue`,
  i_ = `~effect/Queue/Enqueue`,
  a_ = `~effect/Queue/Dequeue`,
  o_ = { _A: I, _E: I },
  s_ = {
    [r_]: o_,
    [i_]: o_,
    [a_]: o_,
    ...Dc,
    toJSON() {
      return { _id: `effect/Queue`, state: this.state._tag, size: y_(this) };
    },
  },
  c_ = (e) =>
    V((t) => {
      let n = Object.create(s_);
      return n.dispatcher = t.currentDispatcher,
        n.capacity = e?.capacity ?? 1 / 0,
        n.strategy = e?.strategy ?? `suspend`,
        n.messages = Bg(),
        n.scheduleRunning = !1,
        n.state = {
          _tag: `Open`,
          takers: new Set(),
          offers: new Set(),
          awaiters: new Set(),
        },
        H(n);
    }),
  l_ = (e) => c_({ capacity: e }),
  u_ = (e, t) =>
    U(() => {
      if (e.state._tag !== `Open`) return b_;
      if (e.messages.length >= e.capacity) {
        switch (e.strategy) {
          case `dropping`:
            return b_;
          case `suspend`:
            return e.capacity <= 0 && e.state.takers.size > 0
              ? (Hg(e.messages, t), w_(e), x_)
              : D_(e, t);
          case `sliding`:
            return Kg(e.messages), Hg(e.messages, t), x_;
        }
      }
      return Hg(e.messages, t), T_(e), x_;
    }),
  d_ = (e, t) =>
    e.state._tag === `Open`
      ? e.messages.length >= e.capacity
        ? e.strategy === `sliding`
          ? (Kg(e.messages), Hg(e.messages, t), !0)
          : e.capacity <= 0 && e.state.takers.size > 0 &&
            (Hg(e.messages, t), w_(e), !0)
        : (Hg(e.messages, t), T_(e), !0)
      : !1,
  f_ = F(2, (e, t) => rf(() => p_(e, t))),
  p_ = (e, t) => {
    if (e.state._tag !== `Open`) return !1;
    let n = Pf(el(t), S_);
    return e.state.offers.size === 0 && e.messages.length === 0
      ? (A_(e, n), !0)
      : (e.state = { ...e.state, _tag: `Closing`, exit: n }, !0);
  },
  m_ = (e) =>
    rf(() => {
      if (e.state._tag === `Done`) return !0;
      Ug(e.messages);
      let t = e.state.offers;
      if (A_(e, e.state._tag === `Open` ? C_ : e.state.exit), t.size > 0) {
        for (let e of t) {
          e._tag === `Single`
            ? e.resume(b_)
            : e.resume(Zc(e.remaining.slice(e.offset)));
        }
        t.clear();
      }
      return !0;
    }),
  h_ = (e) => g_(e, 1, 1 / 0),
  g_ = (e, t, n) => U(() => E_(e, t, n) ?? xf(k_(e), g_(e, 1, n))),
  __ = (e) => U(() => v_(e) ?? xf(k_(e), __(e))),
  v_ = (e) => {
    if (e.state._tag === `Done`) return e.state.exit;
    if (e.messages.length > 0) {
      let t = Kg(e.messages);
      return O_(e), Zc(t);
    }
    if (e.capacity <= 0 && e.state.offers.size > 0) {
      e.capacity = 1, O_(e), e.capacity = 0;
      let t = Kg(e.messages);
      return O_(e), Zc(t);
    }
  },
  y_ = (e) => e.state._tag === `Done` ? 0 : e.messages.length,
  b_ = Zc(!1),
  x_ = Zc(!0),
  S_ = tl(dl()),
  C_ = Af(),
  w_ = (e) => {
    if (
      e.scheduleRunning = !1,
        e.state._tag !== `Done` && e.state.takers.size !== 0
    ) {
      for (
        let t of e.state.takers
      ) if (e.state.takers.delete(t), t(Nf), e.messages.length === 0) break;
    }
  },
  T_ = (e) => {
    e.scheduleRunning || e.state._tag === `Done` || e.state.takers.size === 0 ||
      (e.scheduleRunning = !0, e.dispatcher.scheduleTask(() => w_(e), 0));
  },
  E_ = (e, t, n) => {
    if (e.state._tag === `Done`) return e.state.exit;
    if (n <= 0 || t <= 0) return Zc([]);
    if (e.capacity <= 0 && e.state.offers.size > 0) {
      e.capacity = 1, O_(e), e.capacity = 0;
      let t = [Kg(e.messages)];
      return O_(e), Zc(t);
    }
    if (t = Math.min(t, e.capacity || 1), t <= e.messages.length) {
      let t = Wg(e.messages, n);
      return O_(e), Zc(t);
    }
  },
  D_ = (e, t) =>
    pf((n) => {
      if (e.state._tag !== `Open`) return n(b_);
      let r = { _tag: `Single`, message: t, resume: n };
      return e.state.offers.add(r),
        rf(() => {
          e.state._tag === `Open` && e.state.offers.delete(r);
        });
    }),
  O_ = (e) => {
    if (e.state._tag === `Done`) return uh(e.state.exit.cause);
    if (e.state.offers.size === 0) {
      return e.state._tag === `Closing` && e.messages.length === 0 &&
        (A_(e, e.state.exit), uh(e.state.exit.cause));
    }
    let t = e.capacity - e.messages.length;
    for (let n of e.state.offers) {
      if (t === 0) break;
      else if (n._tag === `Single`) {
        Hg(e.messages, n.message), t--, n.resume(x_), e.state.offers.delete(n);
      } else {
        for (; n.offset < n.remaining.length; n.offset++) {
          if (t === 0) {
            return !1;
          }
          Hg(e.messages, n.remaining[n.offset]), t--;
        }
        n.resume(Zc([])), e.state.offers.delete(n);
      }
    }
    return !1;
  },
  k_ = (e) =>
    pf((t) =>
      e.state._tag === `Done`
        ? t(e.state.exit)
        : (e.state.takers.add(t),
          rf(() => {
            e.state._tag !== `Done` && e.state.takers.delete(t);
          }))
    ),
  A_ = (e, t) => {
    if (e.state._tag === `Done`) return;
    let n = e.state;
    e.state = { _tag: `Done`, exit: t };
    for (let e of n.takers) e(t);
    n.takers.clear();
    for (let e of n.awaiters) e(t);
    n.awaiters.clear();
  },
  j_ = (e) => new N_(e),
  M_ = (e, t, n) =>
    pf((r) => {
      if (e.free >= t) return r(n);
      let i = () => {
        e.free < t || (e.waiters.delete(i), r(n));
      };
      return e.waiters.add(i),
        rf(() => {
          e.waiters.delete(i);
        });
    }),
  N_ = class {
    waiters = new Set();
    taken = 0;
    permits;
    constructor(e) {
      this.permits = e;
    }
    get free() {
      return this.permits - this.taken;
    }
    take(e) {
      let t = U(() => this.free < e ? M_(this, e, t) : (this.taken += e, H(e)));
      return t;
    }
    takeIfAvailable(e) {
      return U(() => this.free < e ? H(!1) : (this.taken += e, H(!0)));
    }
    releaseUnsafe(e, t) {
      return this.taken -= t,
        this.waiters.size > 0 && e.currentDispatcher.scheduleTask(() => {
          for (let e of this.waiters) {
            if (this.free <= 0) break;
            e();
          }
        }, 0),
        this.free;
    }
    resize(e) {
      return V(
        (
          t,
        ) => (this.permits = e, this.free < 0 || this.releaseUnsafe(t, 0), cf),
      );
    }
    release(e) {
      return V((t) => H(this.releaseUnsafe(t, e)));
    }
    get releaseAll() {
      return V((e) => H(this.releaseUnsafe(e, this.taken)));
    }
    withPermits(e) {
      return (t) =>
        Pp((n) => {
          let r = U(() =>
            this.free < e
              ? W(n(M_(this, e, cf)), () => r)
              : (this.taken += e,
                xp(n(t), () => {
                  this.releaseUnsafe(Ud(), e);
                }, !0))
          );
          return r;
        });
    }
    withPermit = this.withPermits(1);
    withPermitsIfAvailable(e) {
      return (t) =>
        Pp((n) =>
          this.free < e ? of : (this.taken += e,
            xp(n(bf(t)), () => {
              this.releaseUnsafe(Ud(), e);
            }, !0))
        );
    }
  },
  P_ = `~effect/Channel`,
  F_ = (e) => bs(e, P_),
  I_ = {
    [P_]: { _Env: I, _InErr: I, _InElem: I, _OutErr: I, _OutElem: I },
    pipe() {
      return cs(this, arguments);
    },
  },
  L_ = (e) => {
    let t = Object.create(I_);
    return t.transform = (t, n) => tg(e(t, n), (e) => G(Kh(e))), t;
  },
  R_ = (e, t) => L_((n, r) => Jh(V_(e)(n, r), (e) => t(e, r))),
  z_ = (e) => L_((t, n) => e),
  B_ = (e) =>
    L_(kg(function* (t, n) {
      let r = Lm(n), i = (e) => Rm(r, mh(e));
      return gg(yield* gg(e(t, n, r), i), i);
    })),
  V_ = (e) => e.transform,
  H_ = (e, t, n) =>
    c_({ capacity: n?.bufferSize, strategy: n?.strategy }).pipe(
      Zh((t) => Im(e, m_(t))),
      Zh((n) => Sg(Pm(t(n), e), e)),
    ),
  U_ = (e, t) => L_((n, r) => Qh(H_(r, e, t), h_)),
  W_ = z_(G(ym())),
  G_ = (e) => z_(G(h_(e))),
  K_ = (e) => z_(G(yg($g(e), () => ym()))),
  q_ = (e) => tv(Qh(Zg(e), K_)),
  J_ = F(2, (e, t) =>
    R_(e, (e) =>
      K(() => {
        let n = 0;
        return Qh(e, (e) => t(e, n++));
      }))),
  Y_ = (e) => e === void 0 || e !== `unbounded` && e <= 1,
  X_ = F(
    (e) => F_(e[0]),
    (e, t, n) => Y_(n?.concurrency) ? Z_(e, t) : Q_(e, t, n),
  ),
  Z_ = (e, t) =>
    L_((n, r) => {
      let i = 0;
      return Qh(V_(e)(n, r), Jh((e) => t(e, i++)));
    }),
  Q_ = (e, t, n) =>
    B_(kg(function* (r, i, a) {
      let o = 0,
        s = yield* V_(e)(r, i),
        c = n.concurrency === `unbounded` ? 2 ** 53 - 1 : n.concurrency,
        l = yield* l_(0);
      yield* Im(a, m_(l));
      let u = wg(yield* lg()), d = Ng(a);
      if (n.unordered) {
        let e = j_(c),
          n = ls(e.release(1)),
          r = cg({
            onFailure: (e) => Jh(f_(l, e), n),
            onSuccess: (e) => Jh(u_(l, e), n),
          });
        yield* e.take(1).pipe(
          Jh(() => s),
          Jh((e) => (d(u(r(t(e, o++)))), Vh)),
          xg({ disableYield: !0 }),
          tg((t) => e.withPermits(c - 1)(f_(l, t))),
          Sg(a),
        );
      } else {
        let e = yield* l_(c - 2);
        yield* Im(a, m_(e)),
          yield* __(e).pipe(
            Yh,
            Jh((e) => u_(l, e)),
            xg({ disableYield: !0 }),
            tg((e) => f_(l, e)),
            Sg(a),
          );
        let n,
          r = (e) => {
            e._tag !== `Success` && (n = e.cause, p_(l, e.cause));
          };
        yield* s.pipe(
          Jh((i) => {
            if (n) return Kh(n);
            let a = u(t(i, o++));
            return d(a), a.addObserver(r), u_(e, Ag(a));
          }),
          xg({ disableYield: !0 }),
          tg((t) => u_(e, Sm(t)).pipe(Xh(f_(e, t)))),
          Sg(a),
        );
      }
      return __(l);
    })),
  $_ = (e) =>
    R_(e, (e) => {
      let t, n = 0;
      return G(Bh(function r() {
        if (t === void 0) {
          return Jh(e, (e) => {
            switch (e.length) {
              case 0:
                return r();
              case 1:
                return G(e[0]);
              default:
                return t = e, G(e[n++]);
            }
          });
        }
        let i = t[n++];
        return n >= t.length && (t = void 0, n = 0), G(i);
      }));
    }),
  ev = F(2, (e, t) =>
    R_(e, (e) =>
      G(Jh(e, function n(r) {
        let i = [];
        for (let e = 0; e < r.length; e++) t(r[e]) && i.push(r[e]);
        return Yl(i) ? G(i) : Jh(e, n);
      })))),
  tv = (e) =>
    L_((t, n) => {
      let r;
      return G(
        Bh(() => r || e.pipe(Pm(n), Jh((e) => V_(e)(t, n)), Jh((e) => r = e))),
      );
    }),
  nv = F(2, (e, t) => B_((n, r, i) => Fm(i, t).pipe(Xh(V_(e)(n, r))))),
  rv = F(2, (e, t) => nv(e, (e) => t)),
  iv = (e, t, n) =>
    Bh(() => {
      let r = Nm();
      return lh(Jh(V_(e)(ym(), r), t), n || G).pipe(_g((e) => Rm(r, e)));
    }),
  av = F(2, (e, t) => iv(e, (e) => xg(Jh(e, t), { disableYield: !0 }))),
  ov = kg(function* (e) {
    let t = j_(1), n = yield* lg(), r = ku(n, Mm);
    return (yield* V_(e)(ym(), r)).pipe(fg(n), t.withPermits(1));
  }, tg((e) => G(Kh(e)))),
  sv = (e, t) => V_(e)(ym(), t),
  cv = `~effect/Stream`,
  lv = { _R: I, _E: I, _A: I },
  uv = {
    [cv]: lv,
    pipe() {
      return cs(this, arguments);
    },
  },
  dv = (e) => {
    let t = Object.create(uv);
    return t.channel = e, t;
  },
  fv = `~effect/Stream`,
  pv = (e) => bs(e, fv),
  mv = dv,
  hv = (e) => e.channel,
  gv = (e, t) => mv(U_(e, t)),
  _v = mv(W_),
  vv = (e) => mv(G_(e)),
  yv = (e) => mv(q_(e)),
  bv = (e) => mv(tv(Qh(e, hv))),
  xv = F(
    (e) => pv(e[0]),
    (e, t, n) => e.channel.pipe($_, X_(t, n), J_(eu), mv),
  ),
  Sv = F(2, (e, t) => mv(ev(hv(e), t))),
  Cv = F(2, (e, t) => mv(rv(e.channel, t))),
  wv = F(2, (e, t) => av(e.channel, t)),
  Tv = (e) => ov(e.channel),
  Ev = class extends iu()(`effect/reactivity/Reactivity`) {},
  Dv = K(() => {
    let e = new Map(),
      t = (t) => {
        Nv(t, (t) => {
          let n = e.get(t);
          n !== void 0 && n.forEach((e) => e());
        });
      },
      n = (e) =>
        ug((n) => {
          let r = Du(n, Ov);
          return r
            ? Nv(e, (e) => {
              r.add(e);
            })
            : t(e),
            Vh;
        }),
      r = (e, t) => Zh(t, n(e)),
      i = (t, n) => {
        let r = [];
        return Nv(t, (t) => {
          r.push(t);
          let i = e.get(t);
          i === void 0 && (i = new Set(), e.set(t, i)), i.add(n);
        }),
          () => {
            for (let t = 0; t < r.length; t++) {
              let i = e.get(r[t]);
              i.delete(n), i.size === 0 && e.delete(r[t]);
            }
          };
      },
      a = (e, t) =>
        Wh(function* () {
          let n = yield* lg(),
            r = ku(n, Mm),
            a = yield* c_(),
            o = ms(wg(n), Ng(r)),
            s = !1,
            c = !1,
            l = (e) => {
              e._tag === `Failure` ? p_(a, e.cause) : d_(a, e.value),
                c ? (c = !1, o(t).addObserver(l)) : s = !1;
            };
          function u() {
            if (s) {
              c = !0;
              return;
            }
            s = !0, o(t).addObserver(l);
          }
          return yield* Im(r, K(i(e, u))), u(), a;
        });
    return Ev.of({
      mutation: r,
      query: a,
      stream: (e, t) => a(e, t).pipe(Qh(vv), bv),
      invalidateUnsafe: t,
      invalidate: n,
      registerUnsafe: i,
      withBatch: (t) =>
        Bh(() => {
          let n = new Set();
          return t.pipe(
            pg(Ov, n),
            _g((t) =>
              K(() => {
                n.forEach((t) => {
                  let n = e.get(t);
                  n !== void 0 && n.forEach((e) => e());
                });
              })
            ),
          );
        }),
    });
  }),
  Ov = class
    extends iu()(`effect/reactivity/Reactivity/PendingInvalidation`) {},
  kv = F(2, (e, t) => Ev.use((n) => n.mutation(t, e))),
  Av = (e) => Ev.use((t) => t.invalidate(e)),
  jv = th(Ev)(Dv);
function Mv(e) {
  switch (typeof e) {
    case `string`:
    case `number`:
    case `bigint`:
    case `boolean`:
      return String(e);
    default:
      return L(e);
  }
}
var Nv = (e, t) => {
    if (Array.isArray(e)) {
      for (let n = 0; n < e.length; n++) t(Mv(e[n]));
      return;
    }
    for (let n in e) {
      t(n);
      let r = e[n];
      for (let e = 0; e < r.length; e++) t(`${n}:${Mv(r[e])}`);
    }
  },
  Pv = `~effect/SubscriptionRef`,
  Fv = (e) => bs(e, Pv);
({ ...Dc });
var Iv = (e) => yv(e.pubsub),
  Lv = (e) => K(() => e.value),
  Rv = (e, t) => {
    e.value = t, Xg(e.pubsub, t);
  },
  zv = F(2, (e, t) => e.semaphore.withPermit(K(() => Rv(e, t)))),
  Bv = 0,
  Vv = performance.now(),
  [Hv, Uv] = oo([]);
function Wv(e, t) {
  let n = ((performance.now() - Vv) / 1e3).toFixed(2) + `s`;
  Uv((r) => {
    r.push({ id: Bv++, time: n, kind: e, message: t }),
      r.length > 100 && r.splice(0, r.length - 100);
  });
}
function Gv() {
  Uv((e) => {
    e.length = 0;
  });
}
var Kv = class extends Td(`TransientNetwork`) {},
  qv = [{
    name: `solid-js`,
    description: `Fine-grained reactive UI library`,
    downloads: 145e4,
  }, {
    name: `@solidjs/web`,
    description: `Solid web platform runtime`,
    downloads: 131e4,
  }, {
    name: `@solidjs/signals`,
    description: `Standalone reactive primitives`,
    downloads: 89e4,
  }, {
    name: `@solidjs/router`,
    description: `Universal router for Solid`,
    downloads: 64e4,
  }, {
    name: `@solidjs/start`,
    description: `Fullstack Solid meta-framework`,
    downloads: 41e4,
  }, {
    name: `@solidjs/meta`,
    description: `Document head management`,
    downloads: 35e4,
  }, {
    name: `solid-devtools`,
    description: `Reactivity graph devtools`,
    downloads: 12e4,
  }, {
    name: `solid-transition-group`,
    description: `Enter/exit animations`,
    downloads: 95e3,
  }, {
    name: `effect`,
    description: `Typed functional effect system`,
    downloads: 98e4,
  }, {
    name: `@effect/platform`,
    description: `Cross-platform runtime services`,
    downloads: 42e4,
  }, {
    name: `@effect/schema`,
    description: `Schema validation and transformation`,
    downloads: 51e4,
  }, {
    name: `@effect/cli`,
    description: `Declarative command-line apps`,
    downloads: 88e3,
  }, {
    name: `@effect-atom/atom-solid`,
    description: `Effect Atom bindings for Solid 1.x`,
    downloads: 12e3,
  }, {
    name: `vite`,
    description: `Next generation frontend tooling`,
    downloads: 124e5,
  }, {
    name: `vitest`,
    description: `Vite-native test runner`,
    downloads: 62e5,
  }, {
    name: `vinxi`,
    description: `Full-stack JS SDK on Nitro + Vite`,
    downloads: 38e4,
  }, {
    name: `seroval`,
    description: `Universal value serialization`,
    downloads: 11e5,
  }, {
    name: `typescript`,
    description: `Typed superset of JavaScript`,
    downloads: 48e6,
  }, {
    name: `esbuild`,
    description: `Extremely fast bundler`,
    downloads: 32e6,
  }, {
    name: `rollup`,
    description: `Module bundler for libraries`,
    downloads: 21e6,
  }, {
    name: `terser`,
    description: `JavaScript mangler and compressor`,
    downloads: 19e6,
  }, {
    name: `prettier`,
    description: `Opinionated code formatter`,
    downloads: 27e6,
  }, {
    name: `zod`,
    description: `TypeScript-first schema validation`,
    downloads: 14e6,
  }, {
    name: `hono`,
    description: `Small, fast web framework`,
    downloads: 21e5,
  }, {
    name: `nitro`,
    description: `Universal server toolkit`,
    downloads: 95e4,
  }, {
    name: `oxc-parser`,
    description: `Rust-based JS/TS parser`,
    downloads: 26e4,
  }, {
    name: `turbo`,
    description: `Incremental monorepo build system`,
    downloads: 34e5,
  }, {
    name: `pnpm`,
    description: `Fast, disk-efficient package manager`,
    downloads: 89e5,
  }],
  Jv = class extends iu()(`SearchConfig`) {},
  Yv = $m(Jv, { flakiness: .35, baseLatencyMs: 250 });
function Xv(e) {
  let t = Wh(function* () {
    let { flakiness: t, baseLatencyMs: n } = yield* Jv;
    if (yield* og(n + Math.random() * 550), Math.random() < t) {
      return yield* K(() =>
        Wv(
          `retry`,
          `search "${e}" hit a transient error — retrying with backoff`,
        )
      ),
        yield* new Kv({ query: e });
    }
    let r = e.toLowerCase();
    return qv.filter((e) =>
      e.name.toLowerCase().includes(r) ||
      e.description.toLowerCase().includes(r)
    ).sort((e, t) => t.downloads - e.downloads);
  });
  return Wh(function* () {
    return yield* K(() => Wv(`start`, `search "${e}" — fiber started`)),
      yield* t.pipe(
        ig({
          schedule: Th(150),
          times: 3,
          while: (e) => e._tag === `TransientNetwork`,
        }),
      );
  }).pipe(
    ag(4e3),
    Zh((t) => K(() => Wv(`success`, `search "${e}" → ${t.length} results`))),
    rg((t) => K(() => Wv(`error`, `search "${e}" failed for good: ${t._tag}`))),
    yg(() =>
      K(() =>
        Wv(
          `interrupt`,
          `search "${e}" interrupted — fiber + pending retries torn down`,
        )
      )
    ),
  );
}
var Zv = class extends Td(`CardDeclined`) {}, Qv = [], $v = 0;
function ey() {
  return Eg(og(300).pipe(Qh(() => Qv.map((e) => ({ ...e })))));
}
function ty(e) {
  return Wh(function* () {
    yield* K(() => Wv(`start`, `reserveInventory — placing hold`)),
      yield* og(900);
    let t = { id: `rsv_${++$v}`, items: e };
    return yield* K(() => Wv(`success`, `reserveInventory → ${t.id} held`)), t;
  }).pipe(
    yg(() =>
      K(() => Wv(`interrupt`, `reserveInventory interrupted — no hold placed`))
    ),
  );
}
function ny(e) {
  return Wh(function* () {
    yield* og(400),
      yield* K(() =>
        Wv(
          `compensate`,
          `releaseReservation → ${e.id} released (saga compensation)`,
        )
      );
  });
}
function ry(e) {
  return Wh(function* () {
    yield* og(400),
      yield* K(() =>
        Wv(
          `compensate`,
          `refundCharge → ${e.id} refunded $${
            e.amount.toFixed(2)
          } (saga compensation)`,
        )
      );
  });
}
function iy(e, t) {
  let n = Wh(function* () {
    if (yield* og(2600), t) return yield* new Zv({ amount: e });
    let n = { id: `ch_${++$v}`, amount: e };
    return yield* K(() =>
      Wv(`success`, `chargeCard → ${n.id} for $${e.toFixed(2)}`)
    ),
      n;
  });
  return Wh(function* () {
    return yield* K(() =>
      Wv(`start`, `chargeCard — authorizing $${e.toFixed(2)}`)
    ),
      yield* n;
  }).pipe(
    rg((e) =>
      K(() =>
        Wv(`error`, `chargeCard failed: ${e._tag} ($${e.amount.toFixed(2)})`)
      )
    ),
    yg(() =>
      K(() =>
        Wv(`compensate`, `chargeCard interrupted — voiding card authorization`)
      )
    ),
  );
}
function ay(e, t, n) {
  return Wh(function* () {
    yield* K(() => Wv(`start`, `createOrder — committing ${t.id} + ${n.id}`)),
      yield* og(700);
    let r = {
      id: `ord_${++$v}`,
      items: e,
      total: n.amount,
      placedAt: new Date().toLocaleTimeString(),
    };
    return Qv = [r, ...Qv],
      yield* K(() => Wv(`success`, `createOrder → ${r.id} confirmed`)),
      r;
  }).pipe(
    yg(() => K(() => Wv(`interrupt`, `createOrder interrupted before commit`))),
  );
}
var oy = (e, t) => {
    switch (t.length) {
      case 0:
        return e;
      case 1:
        return t[0](e);
      case 2:
        return t[1](t[0](e));
      case 3:
        return t[2](t[1](t[0](e)));
      case 4:
        return t[3](t[2](t[1](t[0](e))));
      case 5:
        return t[4](t[3](t[2](t[1](t[0](e)))));
      case 6:
        return t[5](t[4](t[3](t[2](t[1](t[0](e))))));
      case 7:
        return t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))));
      case 8:
        return t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e))))))));
      case 9:
        return t[8](t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))))));
      default: {
        let n = e;
        for (let e = 0, r = t.length; e < r; e++) n = t[e](n);
        return n;
      }
    }
  },
  q = function (e, t) {
    if (typeof e == `function`) {
      return function () {
        return e(arguments)
          ? t.apply(this, arguments)
          : (e) => t(e, ...arguments);
      };
    }
    switch (e) {
      case 0:
      case 1:
        throw RangeError(`Invalid arity ${e}`);
      case 2:
        return function (e, n) {
          return arguments.length >= 2 ? t(e, n) : function (n) {
            return t(n, e);
          };
        };
      case 3:
        return function (e, n, r) {
          return arguments.length >= 3 ? t(e, n, r) : function (r) {
            return t(r, e, n);
          };
        };
      default:
        return function () {
          if (arguments.length >= e) return t.apply(this, arguments);
          let n = arguments;
          return function (e) {
            return t(e, ...n);
          };
        };
    }
  },
  sy = (e) => e,
  cy = ((e) => () => e)(void 0),
  ly = cy,
  uy = (e) => {
    let t = new Set(Reflect.ownKeys(e));
    if (e.constructor === Object) return t;
    e instanceof Error && t.delete(`stack`);
    let n = Object.getPrototypeOf(e), r = n;
    for (; r !== null && r !== Object.prototype;) {
      let e = Reflect.ownKeys(r);
      for (let n = 0; n < e.length; n++) t.add(e[n]);
      r = Object.getPrototypeOf(r);
    }
    return t.has(`constructor`) && typeof e.constructor == `function` &&
      n === e.constructor.prototype && t.delete(`constructor`),
      t;
  },
  dy = new WeakSet();
function fy(e) {
  return typeof e == `function`;
}
function py(e) {
  return typeof e == `object` && !!e || fy(e);
}
var my = q(2, (e, t) => py(e) && t in e),
  hy = `~effect/interfaces/Hash`,
  gy = (e) => {
    switch (typeof e) {
      case `number`:
        return xy(e);
      case `bigint`:
        return Sy(e.toString(10));
      case `boolean`:
        return Sy(String(e));
      case `symbol`:
        return Sy(String(e));
      case `string`:
        return Sy(e);
      case `undefined`:
        return Sy(`undefined`);
      case `function`:
      case `object`:
        if (e === null) return Sy(`null`);
        if (e instanceof Date) {
          return Number.isNaN(e.getTime())
            ? Sy(`Invalid Date`)
            : Sy(e.toISOString());
        }
        if (e instanceof RegExp) return Sy(e.toString());
        {
          if (dy.has(e)) return _y(e);
          if (Ay.has(e)) return Ay.get(e);
          let t = My(
            e,
            () =>
              by(e)
                ? e[hy]()
                : typeof e == `function`
                ? _y(e)
                : e instanceof DataView
                ? Ey(new Uint8Array(e.buffer, e.byteOffset, e.byteLength))
                : Array.isArray(e) || ArrayBuffer.isView(e)
                ? Ey(e)
                : e instanceof Map
                ? Dy(e)
                : e instanceof Set
                ? Oy(e)
                : wy(e),
          );
          return Ay.set(e, t), t;
        }
      default:
        throw Error(
          `BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`,
        );
    }
  },
  _y = (e) => (ky.has(e) ||
    ky.set(e, xy(Math.floor(Math.random() * (2 ** 53 - 1)))),
    ky.get(e)),
  vy = q(2, (e, t) => e * 53 ^ t),
  yy = (e) => e & 3221225471 | e >>> 1 & 1073741824,
  by = (e) => my(e, hy),
  xy = (e) => {
    if (e !== e) return Sy(`NaN`);
    if (e === 1 / 0) return Sy(`Infinity`);
    if (e === -1 / 0) return Sy(`-Infinity`);
    let t = e | 0;
    for (t !== e && (t ^= e * 4294967295); e > 4294967295;) {
      t ^= e /= 4294967295;
    }
    return yy(t);
  },
  Sy = (e) => {
    let t = 5381, n = e.length;
    for (; n;) t = t * 33 ^ e.charCodeAt(--n);
    return yy(t);
  },
  Cy = (e, t) => {
    let n = 12289;
    for (let r of t) n ^= vy(gy(r), gy(e[r]));
    return yy(n);
  },
  wy = (e) => Cy(e, uy(e)),
  Ty = (e, t) => (n) => {
    let r = e;
    for (let e of n) r ^= t(e);
    return yy(r);
  },
  Ey = Ty(6151, gy),
  Dy = Ty(Sy(`Map`), ([e, t]) => vy(gy(e), gy(t))),
  Oy = Ty(Sy(`Set`), gy),
  ky = new WeakMap(),
  Ay = new WeakMap(),
  jy = new WeakSet();
function My(e, t) {
  if (jy.has(e)) return Sy(`[Circular]`);
  jy.add(e);
  let n = t();
  return jy.delete(e), n;
}
var Ny = `~effect/interfaces/Equal`;
function Py() {
  return arguments.length === 1
    ? (e) => Fy(e, arguments[0])
    : Fy(arguments[0], arguments[1]);
}
function Fy(e, t) {
  if (e === t) return !0;
  if (e == null || t == null) return !1;
  let n = typeof e;
  return n === typeof t
    ? n === `number` && e !== e && t !== t
      ? !0
      : n !== `object` && n !== `function` || dy.has(e) || dy.has(t)
      ? !1
      : By(e, t, zy)
    : !1;
}
function Iy(e, t, n) {
  let r = Ly.has(e), i = Ry.has(t);
  if (r && i) return !0;
  if (r || i) return !1;
  Ly.add(e), Ry.add(t);
  let a = n();
  return Ly.delete(e), Ry.delete(t), a;
}
var Ly = new WeakSet(), Ry = new WeakSet();
function zy(e, t) {
  if (gy(e) !== gy(t)) return !1;
  if (e instanceof Date) {
    if (!(t instanceof Date)) return !1;
    let n = e.getTime(), r = t.getTime();
    return n === r || Number.isNaN(n) && Number.isNaN(r);
  }
  if (e instanceof RegExp) {
    return t instanceof RegExp && e.toString() === t.toString();
  }
  let n = Yy(e), r = Yy(t);
  if (n !== r) return !1;
  let i = n && r;
  return typeof e == `function` && !i ? !1 : Iy(e, t, () => {
    if (i) return e[Ny](t);
    if (Array.isArray(e)) {
      return !Array.isArray(t) || e.length !== t.length ? !1 : Hy(e, t);
    }
    if (ArrayBuffer.isView(e)) {
      let n = e instanceof DataView;
      if (
        !ArrayBuffer.isView(t) || e.byteLength !== t.byteLength ||
        n !== t instanceof DataView
      ) return !1;
      if (n) {
        let n = t;
        return Uy(
          new Uint8Array(e.buffer, e.byteOffset, e.byteLength),
          new Uint8Array(n.buffer, n.byteOffset, n.byteLength),
        );
      }
      return Uy(e, t);
    }
    return e instanceof Map
      ? !(t instanceof Map) || e.size !== t.size ? !1 : Ky(e, t)
      : e instanceof Set
      ? !(t instanceof Set) || e.size !== t.size ? !1 : Jy(e, t)
      : Wy(e, t);
  });
}
function By(e, t, n) {
  let r = Vy.get(e);
  if (!r) r = new WeakMap(), Vy.set(e, r);
  else if (r.has(t)) return r.get(t);
  let i = n(e, t);
  r.set(t, i);
  let a = Vy.get(t);
  return a || (a = new WeakMap(), Vy.set(t, a)), a.set(e, i), i;
}
var Vy = new WeakMap();
function Hy(e, t) {
  for (let n = 0; n < e.length; n++) if (!Fy(e[n], t[n])) return !1;
  return !0;
}
function Uy(e, t) {
  if (e.length !== t.length) return !1;
  for (let n = 0; n < e.length; n++) if (e[n] !== t[n]) return !1;
  return !0;
}
function Wy(e, t) {
  let n = uy(e), r = uy(t);
  if (n.size !== r.size) return !1;
  for (let i of n) if (!r.has(i) || !Fy(e[i], t[i])) return !1;
  return !0;
}
function Gy(e, t) {
  return function (n, r) {
    let i = Array.from(r);
    for (let [r, a] of n) {
      let n = !1;
      for (let o = 0; o < i.length; o++) {
        let [s, c] = i[o];
        if (e(r, s) && t(a, c)) {
          i[o] = i[i.length - 1], i.pop(), n = !0;
          break;
        }
      }
      if (!n) return !1;
    }
    return !0;
  };
}
var Ky = Gy(Fy, Fy);
function qy(e) {
  return function (t, n) {
    let r = Array.from(n);
    for (let n of t) {
      let t = !1;
      for (let i = 0; i < r.length; i++) {
        let a = r[i];
        if (e(n, a)) {
          r[i] = r[r.length - 1], r.pop(), t = !0;
          break;
        }
      }
      if (!t) return !1;
    }
    return !0;
  };
}
var Jy = qy(Fy), Yy = (e) => my(e, Ny), Xy = (e) => e.length > 0;
function Zy(e, t, n) {
  t === `__proto__`
    ? Object.defineProperty(e, t, {
      value: n,
      writable: !0,
      enumerable: !0,
      configurable: !0,
    })
    : e[t] = n;
}
function Qy(e, t) {
  for (let n of Reflect.ownKeys(t)) {
    Object.prototype.propertyIsEnumerable.call(t, n) && Zy(e, n, t[n]);
  }
}
var $y = Symbol.for(`~effect/Redactable`);
function eb(e) {
  return e[$y](globalThis[`~effect/Fiber/currentFiber`]?.context ?? rb);
}
var tb = `~effect/Fiber/currentFiber`,
  nb = new Map(),
  rb = {
    "~effect/Context": {},
    base: nb,
    depth: 0,
    mapUnsafe: nb,
    pipe() {
      return oy(this, arguments);
    },
  };
function ib(e, t) {
  let n = t?.space ?? 0,
    r = new WeakSet(),
    i = n ? typeof n == `number` ? ` `.repeat(n) : n : ``,
    a = (e) => i.repeat(e),
    o = (e, t) => {
      let n = e?.constructor;
      return n && n !== Object.prototype.constructor && n.name
        ? `${n.name}(${t})`
        : t;
    },
    s = (e) => {
      try {
        return Reflect.ownKeys(e);
      } catch {
        return [`[ownKeys threw]`];
      }
    };
  function c(e, n = 0) {
    if (typeof e == `string`) return JSON.stringify(e);
    if (
      typeof e == `number` || e == null || typeof e == `boolean` ||
      typeof e == `symbol`
    ) return String(e);
    if (typeof e == `bigint`) return String(e) + `n`;
    if (typeof e == `object` || typeof e == `function`) {
      if (r.has(e)) return ab;
      r.add(e);
      let l;
      if ($y in e) l = c(eb(e), n);
      else if (Array.isArray(e)) {
        l = !i || e.length <= 1
          ? `[${e.map((e) => c(e, n)).join(`,`)}]`
          : `[\n${a(n + 1)}${
            e.map((e) => c(e, n + 1)).join(
              `,
` + a(n + 1),
            )
          }\n${a(n)}]`;
      } else if (e instanceof Date) l = sb(e);
      else if (
        !t?.ignoreToString && my(e, `toString`) &&
        typeof e.toString == `function` &&
        e.toString !== Object.prototype.toString &&
        e.toString !== Array.prototype.toString
      ) {
        let t = cb(e);
        l = e instanceof Error && e.cause
          ? `${t} (cause: ${c(e.cause, n)})`
          : t;
      } else if (Symbol.iterator in e) {
        l = `${e.constructor.name}(${c(Array.from(e), n)})`;
      } else {
        let t = s(e);
        if (!i || t.length <= 1) {
          let r = `{${t.map((t) => `${ob(t)}:${c(e[t], n)}`).join(`,`)}}`;
          l = o(e, r);
        } else {
          let r = `{\n${
            t.map((t) => `${a(n + 1)}${ob(t)}: ${c(e[t], n + 1)}`).join(`,
`)
          }\n${a(n)}}`;
          l = o(e, r);
        }
      }
      return r.delete(e), l;
    }
    return String(e);
  }
  return c(e, 0);
}
var ab = `[Circular]`;
function ob(e) {
  return typeof e == `string` ? JSON.stringify(e) : String(e);
}
function sb(e) {
  try {
    return e.toISOString();
  } catch {
    return `Invalid Date`;
  }
}
function cb(e) {
  try {
    let t = e.toString();
    return typeof t == `string` ? t : String(t);
  } catch {
    return `[toString threw]`;
  }
}
var lb = Symbol.for(`nodejs.util.inspect.custom`),
  ub = class e {
    called = !1;
    self;
    constructor(e) {
      this.self = e;
    }
    next(e) {
      return this.called
        ? { value: e, done: !0 }
        : (this.called = !0, { value: this.self, done: !1 });
    }
    [Symbol.iterator]() {
      return new e(this.self);
    }
  },
  db = (() => {
    let e = `~effect/Utils/internal`,
      t = { [e]: (e) => e() },
      n = {
        [e]: (e) => {
          try {
            return e();
          } finally {
          }
        },
      };
    return t[e](() => Error().stack)?.includes(e) === !0 ? t[e] : n[e];
  })(),
  fb = `~effect/Effect`,
  pb = `~effect/Exit`,
  mb = { _A: sy, _E: sy, _R: sy },
  hb = `${fb}/identifier`,
  J = `${fb}/args`,
  gb = `${fb}/evaluate`,
  _b = `${fb}/successCont`,
  vb = `${fb}/failureCont`,
  yb = `${fb}/ensureCont`,
  bb = Symbol.for(`effect/Effect/Yield`),
  xb = {
    pipe() {
      return oy(this, arguments);
    },
    toJSON() {
      return { ...this };
    },
    toString() {
      return ib(this.toJSON(), { ignoreToString: !0, space: 2 });
    },
    [lb]() {
      return this.toJSON();
    },
  },
  Sb = {
    [fb]: mb,
    ...xb,
    [Symbol.iterator]() {
      return new ub(this);
    },
    toJSON() {
      return {
        _id: `Effect`,
        op: this[hb],
        ...J in this ? { args: this[J] } : void 0,
      };
    },
  },
  Cb = (e) => my(e, fb),
  wb = (e) => my(e, pb),
  Tb = `~effect/Cause`,
  Eb = `~effect/Cause/Reason`,
  Db = (e) => my(e, Tb),
  Ob = class {
    [Tb];
    reasons;
    constructor(e) {
      this[Tb] = Tb, this.reasons = e;
    }
    pipe() {
      return oy(this, arguments);
    }
    toJSON() {
      return { _id: `Cause`, failures: this.reasons.map((e) => e.toJSON()) };
    }
    toString() {
      return `Cause(${ib(this.reasons)})`;
    }
    [lb]() {
      return this.toJSON();
    }
    [Ny](e) {
      return Db(e) && this.reasons.length === e.reasons.length &&
        this.reasons.every((t, n) => Py(t, e.reasons[n]));
    }
    [hy]() {
      return Ey(this.reasons);
    }
  },
  kb = new WeakMap(),
  Ab = class {
    [Eb];
    annotations;
    _tag;
    constructor(e, t, n) {
      if (
        this[Eb] = Eb,
          this._tag = e,
          t !== jb && typeof n == `object` && n && t.size > 0
      ) {
        let e = kb.get(n);
        e && (t = new Map([...e, ...t])), kb.set(n, t);
      }
      this.annotations = t;
    }
    annotate(e, t) {
      if (e.mapUnsafe.size === 0) return this;
      let n = new Map(this.annotations);
      e.mapUnsafe.forEach((e, r) => {
        t?.overwrite !== !0 && n.has(r) || n.set(r, e);
      });
      let r = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
      return r.annotations = n, r;
    }
    pipe() {
      return oy(this, arguments);
    }
    toString() {
      return ib(this);
    }
    [lb]() {
      return this.toString();
    }
  },
  jb = new Map(),
  Mb = class extends Ab {
    error;
    constructor(e, t = jb) {
      super(`Fail`, t, e), this.error = e;
    }
    toString() {
      return `Fail(${ib(this.error)})`;
    }
    toJSON() {
      return { _tag: `Fail`, error: this.error };
    }
    [Ny](e) {
      return Rb(e) && Py(this.error, e.error) &&
        Py(this.annotations, e.annotations);
    }
    [hy]() {
      return vy(Sy(this._tag))(vy(gy(this.error))(gy(this.annotations)));
    }
  },
  Nb = (e) => new Ob(e),
  Pb = (e) => new Ob([new Mb(e)]),
  Fb = class extends Ab {
    defect;
    constructor(e, t = jb) {
      super(`Die`, t, e), this.defect = e;
    }
    toString() {
      return `Die(${ib(this.defect)})`;
    }
    toJSON() {
      return { _tag: `Die`, defect: this.defect };
    }
    [Ny](e) {
      return zb(e) && Py(this.defect, e.defect) &&
        Py(this.annotations, e.annotations);
    }
    [hy]() {
      return vy(Sy(this._tag))(vy(gy(this.defect))(gy(this.annotations)));
    }
  },
  Ib = (e) => new Ob([new Fb(e)]),
  Lb = q(
    (e) => Db(e[0]),
    (e, t, n) =>
      t.mapUnsafe.size === 0
        ? e
        : new Ob(e.reasons.map((e) => e.annotate(t, n))),
  ),
  Rb = (e) => e._tag === `Fail`,
  zb = (e) => e._tag === `Die`,
  Bb = (e) => e._tag === `Interrupt`;
function Vb(e) {
  return Xb(`Effect.evaluate: Not implemented`);
}
var Hb = (e) => ({
    ...Sb,
    [hb]: e.op,
    [gb]: e[gb] ?? Vb,
    [_b]: e[_b],
    [vb]: e[vb],
    [yb]: e[yb],
  }),
  Ub = (e) => {
    let t = Hb(e);
    return function () {
      let n = Object.create(t);
      return n[J] = e.single === !1 ? arguments : arguments[0], n;
    };
  },
  Wb = (e) => {
    let t = {
      [pb]: pb,
      _tag: e.op,
      get [e.prop]() {
        return this[J];
      },
      ...Hb(e),
      toString() {
        return `${e.op}(${ib(this[J])})`;
      },
      toJSON() {
        return { _id: `Exit`, _tag: e.op, [e.prop]: this[J] };
      },
      [Ny](e) {
        return wb(e) && e._tag === this._tag && Py(this[J], e[J]);
      },
      [hy]() {
        return vy(Sy(e.op), gy(this[J]));
      },
    };
    return function (e) {
      let n = Object.create(t);
      return n[J] = e, n;
    };
  },
  Gb = Wb({
    op: `Success`,
    prop: `value`,
    [gb](e) {
      let t = e.getCont(_b);
      return t ? t[_b](this[J], e, this) : e.yieldWith(this);
    },
  }),
  Kb = { key: `effect/Cause/StackTrace` },
  qb = { key: `effect/Cause/InterruptorStackTrace` },
  Jb = Wb({
    op: `Failure`,
    prop: `cause`,
    [gb](e) {
      let t = this[J], n = !1;
      e.currentStackFrame &&
        (t = Lb(t, { mapUnsafe: new Map([[Kb.key, e.currentStackFrame]]) }),
          n = !0);
      let r = e.getCont(vb);
      for (; e.interruptible && e._interruptedCause && r;) r = e.getCont(vb);
      return r ? r[vb](t, e, n ? void 0 : this) : e.yieldWith(n ? Jb(t) : this);
    },
  }),
  Yb = (e) => Jb(Pb(e)),
  Xb = (e) => Jb(Ib(e)),
  Zb = Ub({
    op: `WithFiber`,
    [gb](e) {
      return this[J](e);
    },
  }),
  Qb = function () {
    class e extends globalThis.Error {}
    let t = Hb({
      op: `YieldableError`,
      [gb]() {
        return Yb(this);
      },
    });
    return delete t.toString, Object.assign(e.prototype, t), e;
  }(),
  $b = function () {
    let e = Symbol.for(`effect/Data/Error/plainArgs`);
    return class extends Qb {
      constructor(t) {
        super(t?.message, t?.cause ? { cause: t.cause } : void 0),
          t &&
          (Qy(this, t),
            Object.defineProperty(this, e, { value: t, enumerable: !1 }));
      }
      toJSON() {
        return { ...this[e], ...this };
      }
    };
  }(),
  ex = (e) => {
    class t extends $b {
      _tag = e;
    }
    return t.prototype.name = e, t;
  },
  tx = globalThis.Array,
  nx = (e) => tx.isArray(e) ? e : tx.from(e),
  rx = q(2, (e, t) => nx(e).concat(nx(t)));
tx.isArray;
var ix = Xy,
  ax = (e, t) => {
    let n = gy(t), r = e.get(n);
    if (r === void 0) return e.set(n, [t]), !0;
    for (let e of r) if (Py(e, t)) return !1;
    return r.push(t), !0;
  },
  ox = q(2, (e, t) => {
    let n = nx(e), r = nx(t);
    return ix(n) ? ix(r) ? sx(rx(n, r)) : n : r;
  }),
  sx = (e) => {
    let t = nx(e);
    if (t.length < 2) return [...t];
    let n = new Map(), r = [];
    for (let e of t) ax(n, e) && r.push(e);
    return r;
  },
  cx = (e) => Hb({ op: e.label, [gb]: e.evaluate }),
  lx = `~effect/Context/Service`,
  ux = function () {
    function e() {}
    let t = e;
    Object.setPrototypeOf(t, dx);
    let n = (
      e,
      n,
    ) => (t.key = e,
      n?.defaultValue && (t[px] = px, t.defaultValue = n.defaultValue),
      n?.make && (t.make = n.make),
      n?.fiberCached && fx.add(e),
      t);
    return arguments.length > 0 ? n(arguments[0], arguments[1]) : n;
  },
  dx = {
    [lx]: lx,
    ...cx({
      label: `Service`,
      evaluate(e) {
        return Gb(Fx(e.context, this));
      },
    }),
    toJSON() {
      return { _id: `Service`, key: this.key };
    },
    of(e) {
      return e;
    },
    context(e) {
      return Ax(this, e);
    },
    use(e) {
      return Zb((t) => e(Fx(t.context, this)));
    },
    useSync(e) {
      return Zb((t) => Gb(e(Fx(t.context, this))));
    },
  },
  fx = new Set(),
  px = `~effect/Context/Reference`,
  mx = `~effect/Context`,
  hx = 8,
  gx = 8,
  _x = (e, t, n, r) => {
    let i = Object.create(wx);
    return i.cacheRoot = e ?? i,
      i.base = t,
      i.overlay = n,
      i.depth = r,
      i._flat = void 0,
      i.baseHits = 0,
      i;
  },
  vx = (e, t) => {
    t && (vx(e, t.parent), e.set(t.key, t.value));
  },
  yx = (e) => {
    if (e._flat) return e._flat;
    if (!e.overlay) return e._flat = e.base;
    let t = new Map(e.base);
    return vx(t, e.overlay), e._flat = t;
  },
  bx = (e, t) => {
    let n = new Map(e.mapUnsafe);
    return t(n), Cx(n);
  },
  xx = Symbol(),
  Sx = (e, t) => {
    let n = e;
    for (let e = n.overlay; e; e = e.parent) if (e.key === t) return e.value;
    let r = n.base.get(t);
    return r === void 0 && !n.base.has(t)
      ? xx
      : (n.overlay && ++n.baseHits >= gx &&
        (n.base = yx(n), n.overlay = void 0, n.depth = 0),
        r);
  },
  Cx = (e) => _x(void 0, e, void 0, 0),
  wx = {
    get mapUnsafe() {
      return yx(this);
    },
    ...xb,
    [mx]: { _Services: (e) => e },
    toJSON() {
      return {
        _id: `Context`,
        services: Array.from(this.mapUnsafe).map(([e, t]) => ({
          key: e,
          value: t,
        })),
      };
    },
    [Ny](e) {
      if (!Ex(e)) return !1;
      let t = this.mapUnsafe, n = e.mapUnsafe;
      if (t.size !== n.size) return !1;
      for (let [e, r] of t) if (!n.has(e) || !Py(r, n.get(e))) return !1;
      return !0;
    },
    [hy]() {
      return xy(this.mapUnsafe.size);
    },
  },
  Tx = (e, t) => e.cacheRoot === t.cacheRoot,
  Ex = (e) => my(e, mx),
  Dx = (e) => !!e[px],
  Ox = () => kx,
  kx = Cx(new Map()),
  Ax = (e, t) => Cx(new Map([[e.key, t]])),
  jx = q(3, (e, t, n) => Mx(e, t.key, n)),
  Mx = (e, t, n) => {
    let r = e, i = fx.has(t) ? void 0 : r.cacheRoot;
    if (r.depth >= hx) {
      let e = new Map(r.mapUnsafe);
      return e.set(t, n), _x(i, e, void 0, 0);
    }
    return _x(i, r.base, { key: t, value: n, parent: r.overlay }, r.depth + 1);
  },
  Nx = q(2, (e, t) => Px(e, t.key)),
  Px = (e, t) => {
    let n = Sx(e, t);
    return n === xx ? void 0 : n;
  },
  Fx = q(2, (e, t) => {
    let n = Sx(e, t.key);
    if (n === xx) {
      if (Dx(t)) return Lx(t);
      throw Rx(t);
    }
    return n;
  }),
  Ix = `~effect/Context/defaultValue`,
  Lx = (e) => Ix in e ? e[Ix] : e[Ix] = e.defaultValue(),
  Rx = (e) => {
    let t = Error(`Service not found${e.key ? `: ${String(e.key)}` : ``}`);
    if (t.stack) {
      let e = t.stack.split(`
`);
      e.splice(1, 3),
        t.stack = e.join(`
`);
    }
    return t;
  },
  zx = q(
    2,
    (e, t) =>
      e.mapUnsafe.size === 0
        ? t
        : t.mapUnsafe.size === 0
        ? e
        : bx(e, (e) => t.mapUnsafe.forEach((t, n) => e.set(n, t))),
  ),
  Bx = ux,
  Vx = Bx(`effect/Scheduler`, {
    fiberCached: !0,
    defaultValue: () => new Gx(),
  }),
  Hx = `setImmediate` in globalThis
    ? (e) => {
      let t = globalThis.setImmediate(e);
      return () => globalThis.clearImmediate(t);
    }
    : (e) => {
      let t = setTimeout(e, 0);
      return () => clearTimeout(t);
    },
  Ux = (e) => {
    let t = !1;
    return Promise.resolve().then(() => {
      t || e();
    }),
      () => {
        t = !0;
      };
  },
  Wx = class {
    buckets = [];
    scheduleTask(e, t) {
      let n = this.buckets, r = n.length, i, a = 0;
      for (; a < r && !(n[a][0] > t); a++) i = n[a];
      i && i[0] === t
        ? i[1].push(e)
        : a === r
        ? n.push([t, [e]])
        : n.splice(a, 0, [t, [e]]);
    }
    drain() {
      let e = this.buckets;
      return this.buckets = [], e;
    }
  },
  Gx = class {
    executionMode;
    setImmediate;
    constructor(e = `async`, t) {
      this.executionMode = e, this.setImmediate = t ?? (e === `sync` ? Ux : Hx);
    }
    shouldYield(e) {
      return e.currentOpCount >= e.maxOpsBeforeYield;
    }
    makeDispatcher() {
      return new Kx(this.setImmediate);
    }
  },
  Kx = class {
    tasks = new Wx();
    running = void 0;
    setImmediate;
    constructor(e = Hx) {
      this.setImmediate = e;
    }
    scheduleTask(e, t) {
      this.tasks.scheduleTask(e, t),
        this.running === void 0 &&
        (this.running = this.setImmediate(this.afterScheduled));
    }
    afterScheduled = () => {
      this.running = void 0, this.runTasks();
    };
    runTasks() {
      let e = this.tasks.drain();
      for (let t = 0; t < e.length; t++) {
        let n = e[t][1];
        for (let e = 0; e < n.length; e++) n[e]();
      }
    }
    flush() {
      for (; this.tasks.buckets.length > 0;) {
        this.running !== void 0 && (this.running(), this.running = void 0),
          this.runTasks();
      }
    }
  },
  qx = Bx(`effect/Scheduler/MaxOpsBeforeYield`, {
    fiberCached: !0,
    defaultValue: () => 2048,
  }),
  Jx = Bx(`effect/Scheduler/PreventSchedulerYield`, {
    fiberCached: !0,
    defaultValue: () => !1,
  }),
  Yx = `effect/Tracer/ParentSpan`,
  Xx = `effect/Tracer`,
  Zx = `effect/observability/Metric/FiberRuntimeMetricsKey`,
  Qx = Bx(`effect/References/CurrentStackFrame`, {
    fiberCached: !0,
    defaultValue: cy,
  }),
  $x = Bx(`effect/References/CurrentLogLevel`, {
    fiberCached: !0,
    defaultValue: () => `Info`,
  }),
  eS = Bx(`effect/References/MinimumLogLevel`, {
    fiberCached: !0,
    defaultValue: () => `Info`,
  }),
  tS = class extends Ab {
    fiberId;
    constructor(e, t = jb) {
      super(`Interrupt`, t, `Interrupted`), this.fiberId = e;
    }
    toString() {
      return `Interrupt(${this.fiberId})`;
    }
    toJSON() {
      return { _tag: `Interrupt`, fiberId: this.fiberId };
    }
    [Ny](e) {
      return Bb(e) && this.fiberId === e.fiberId &&
        this.annotations === e.annotations;
    }
    [hy]() {
      return vy(Sy(`${this._tag}:${this.fiberId}`))(_y(this.annotations));
    }
  },
  nS = (e) => new Ob([new tS(e)]),
  rS = (e) => e.reasons.some(Bb),
  iS = q(2, (e, t) => {
    if (e.reasons.length === 0) return t;
    if (t.reasons.length === 0) return e;
    let n = new Ob(ox(e.reasons, t.reasons));
    return Py(e, n) ? e : n;
  }),
  aS = (e) => {
    let t = { Fail: [], Die: [], Interrupt: [] };
    for (let n = 0; n < e.reasons.length; n++) {
      t[e.reasons[n]._tag].push(e.reasons[n]);
    }
    return t;
  },
  oS = (e) => {
    let t = aS(e);
    return t.Fail.length > 0
      ? t.Fail[0].error
      : t.Die.length > 0
      ? t.Die[0].defect
      : t.Interrupt.length > 0
      ? new globalThis.Error(`All fibers interrupted without error`)
      : new globalThis.Error(`Empty cause`);
  },
  sS = `~effect/Fiber`,
  cS = { _A: sy, _E: sy },
  lS = { id: 0 },
  uS = () => globalThis[tb],
  dS = class {
    constructor(e, t = !0) {
      this[sS] = cS,
        this.setContext(e),
        this.id = ++lS.id,
        this.currentOpCount = 0,
        this.interruptible = t,
        this._stack = [],
        this._observers = [],
        this._exit = void 0,
        this._children = void 0,
        this._interruptedCause = void 0,
        this._yielded = void 0,
        this._running = !1,
        this._deferredInterrupt = !1,
        this.runtimeMetrics?.recordFiberStart(this.context);
    }
    [sS];
    id;
    interruptible;
    currentOpCount;
    _stack;
    _observers;
    _exit;
    _children;
    _interruptedCause;
    _yielded;
    _running;
    _deferredInterrupt;
    context;
    currentScheduler;
    currentTracerContext;
    currentSpan;
    currentLogLevel;
    minimumLogLevel;
    currentStackFrame;
    runtimeMetrics;
    maxOpsBeforeYield;
    currentPreventYield;
    _dispatcher = void 0;
    get currentDispatcher() {
      return this._dispatcher ??= this.currentScheduler.makeDispatcher();
    }
    getRef(e) {
      return Fx(this.context, e);
    }
    addObserver(e) {
      return this._exit
        ? (e(this._exit), ly)
        : (this._observers.push(e), () => {
          if (this._exit) return;
          let t = this._observers.indexOf(e);
          t >= 0 && this._observers.splice(t, 1);
        });
    }
    interruptUnsafe(e, t) {
      if (this._exit) return;
      let n = nS(e);
      this.currentStackFrame && (n = Lb(n, Ax(Kb, this.currentStackFrame))),
        t && (n = Lb(n, t)),
        this._interruptedCause = this._interruptedCause
          ? iS(this._interruptedCause, n)
          : n,
        this.interruptible &&
        (this._running
          ? this._deferredInterrupt = !0
          : this.evaluate(bS(this._interruptedCause)));
    }
    pollUnsafe() {
      return this._exit;
    }
    evaluate(e) {
      if (this._exit) return;
      if (this._yielded !== void 0) {
        let e = this._yielded;
        this._yielded = void 0, e();
      }
      let t = this.runLoop(e);
      if (t === bb) return;
      let n = pS.interruptChildren && pS.interruptChildren(this);
      if (n !== void 0) return this.evaluate(IS(n, () => t));
      this._exit = t,
        this.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
      for (let e = 0; e < this._observers.length; e++) this._observers[e](t);
      this._observers.length = 0,
        this._stack.length = 0,
        this._children = void 0,
        this.context = Ox();
    }
    runLoop(e) {
      let t = globalThis[tb];
      globalThis[tb] = this;
      let n = this._running;
      this._running = !0;
      let r = !1, i = e;
      this.currentOpCount = 0;
      try {
        for (;;) {
          if (
            this._deferredInterrupt &&
            (this._deferredInterrupt = !1, i = bS(this._interruptedCause)),
              this.currentOpCount++,
              !r && !this.currentPreventYield &&
              this.currentScheduler.shouldYield(this)
          ) {
            r = !0;
            let e = i;
            i = IS(CS, () => e);
          }
          if (
            i = this.currentTracerContext
              ? this.currentTracerContext(i, this)
              : i[gb](this), i === bb
          ) {
            let e = this._yielded;
            if (pb in e) {
              return this._deferredInterrupt = !1, this._yielded = void 0, e;
            }
            if (this._deferredInterrupt) {
              this._yielded = void 0, e();
              continue;
            }
            return bb;
          }
        }
      } catch (e) {
        return my(i, gb)
          ? this.runLoop(Xb(e))
          : Xb(`Fiber.runLoop: Not a valid effect: ${String(i)}`);
      } finally {
        this._running = n, globalThis[tb] = t;
      }
    }
    getCont(e) {
      if (this._deferredInterrupt) return this._deferredInterrupt = !1, fS;
      for (;;) {
        let t = this._stack.pop();
        if (!t) return;
        let n = t[yb] && t[yb](this);
        if (n) return n[e] = n, n;
        if (t[e]) return t;
      }
    }
    yieldWith(e) {
      return this._yielded = e, bb;
    }
    children() {
      return this._children ??= new Set();
    }
    pipe() {
      return oy(this, arguments);
    }
    setContext(e) {
      let t = this.context;
      if (this.context = e, t !== void 0 && Tx(t, e)) return;
      let n = this.getRef(Vx);
      n !== this.currentScheduler &&
      (this.currentScheduler = n, this._dispatcher = void 0),
        this.currentSpan = Px(e, Yx),
        this.currentLogLevel = this.getRef($x),
        this.minimumLogLevel = this.getRef(eS),
        this.currentStackFrame = this.getRef(Qx),
        this.maxOpsBeforeYield = this.getRef(qx),
        this.currentPreventYield = this.getRef(Jx),
        this.runtimeMetrics = Px(e, Zx);
      let r = Px(e, Xx);
      this.currentTracerContext = r ? r.context : void 0;
    }
    get currentSpanLocal() {
      return this.currentSpan?._tag === `Span` ? this.currentSpan : void 0;
    }
  },
  fS = {
    [_b](e, t) {
      return bS(t._interruptedCause);
    },
    [vb](e, t) {
      return bS(t._interruptedCause);
    },
  },
  pS = { interruptChildren: void 0 },
  mS = (e) => {
    if (!e.currentStackFrame) return;
    let t = new Map();
    return t.set(qb.key, e.currentStackFrame), Cx(t);
  },
  hS = (e) => {
    let t = e;
    return t._exit
      ? yS(t._exit)
      : OS((n) =>
        t._exit ? n(yS(t._exit)) : xS(e.addObserver((e) => n(yS(e))))
      );
  },
  gS = (e) =>
    OS((t) => {
      let n = e[Symbol.iterator](), r = [], i;
      function a() {
        let e = n.next();
        for (; !e.done;) {
          if (e.value._exit) {
            r.push(e.value._exit), e = n.next();
            continue;
          }
          i = e.value.addObserver((e) => {
            r.push(e), a();
          });
          return;
        }
        t(yS(r));
      }
      return a(), xS(() => i?.());
    }),
  _S = (e) => Zb((t) => vS(e, t.id)),
  vS = q((e) => my(e[0], sS), (e, t, n) =>
    Zb((r) => {
      let i = mS(r);
      return i = i && n ? zx(i, n) : i ?? n, e.interruptUnsafe(t, i), FS(hS(e));
    })),
  yS = Gb,
  bS = Jb,
  xS = Ub({
    op: `Sync`,
    [gb](e) {
      let t = this[J](), n = e.getCont(_b);
      return n ? n[_b](t, e) : e.yieldWith(Gb(t));
    },
  }),
  SS = Ub({
    op: `Suspend`,
    [gb](e) {
      return this[J]();
    },
  }),
  CS = Ub({
    op: `Yield`,
    [gb](e) {
      let t = !1;
      return e.currentDispatcher.scheduleTask(() => {
        t || e.evaluate(WS);
      }, this[J] ?? 0),
        e.yieldWith(() => {
          t = !0;
        });
    },
  })(0),
  wS = (e) => Xb(e),
  TS = yS(void 0),
  ES = Ub({
    op: `Async`,
    single: !1,
    [gb](e) {
      let t = db(() => this[J][0].bind(e.currentScheduler)),
        n = !1,
        r = !1,
        i = this[J][1] ? new AbortController() : void 0,
        a = t((t) => {
          n || (n = !0, r ? e.evaluate(t) : r = t);
        }, i?.signal);
      return r === !1
        ? (r = !0,
          e._yielded = () => {
            n = !0;
          },
          i === void 0 && a === void 0 ||
          e._stack.push(DS(() => (n = !0, i?.abort(), a ?? WS))),
          bb)
        : r;
    },
  }),
  DS = Ub({
    op: `AsyncFinalizer`,
    [yb](e) {
      e.interruptible && (e.interruptible = !1, e._stack.push(mC));
    },
    [vb](e, t) {
      return rS(e) ? IS(this[J](), () => bS(e)) : bS(e);
    },
  }),
  OS = (e) => ES(e, e.length >= 2),
  kS = (e, ...t) => {
    let n = t.length === 0
      ? function () {
        return SS(() => jS(e.apply(this, arguments)));
      }
      : function () {
        let n = SS(() => jS(e.apply(this, arguments)));
        for (let e = 0; e < t.length; e++) n = t[e](n, ...arguments);
        return n;
      };
    return AS(e.length, n);
  },
  AS = (e, t) =>
    Object.defineProperty(t, "length", { value: e, configurable: !0 }),
  jS = Ub({
    op: `Iterator`,
    single: !1,
    [_b](e, t) {
      let n = this[J][0];
      for (;;) {
        let r = n.next(e);
        if (r.done) return yS(r.value);
        if (!RS(r.value)) return t._stack.push(this), r.value;
        if (r.value._tag === `Failure`) return r.value;
        e = r.value.value;
      }
    },
    [gb](e) {
      return this[_b](this[J][1], e);
    },
  }),
  MS = q(2, (e, t) => {
    let n = yS(t);
    return IS(e, (e) => n);
  }),
  NS = q(2, (e, t) => IS(e, (e) => Cb(t) ? t : db(() => t(e)))),
  PS = q(2, (e, t) => IS(e, (e) => MS(Cb(t) ? t : db(() => t(e)), e))),
  FS = (e) => IS(e, (e) => WS),
  IS = q(2, (e, t) => {
    let n = Object.create(LS);
    return n[J] = e, n[_b] = t.length === 1 ? t : (e) => t(e), n;
  }),
  LS = Hb({
    op: `OnSuccess`,
    [gb](e) {
      return e._stack.push(this), this[J];
    },
  }),
  RS = (e) => pb in e,
  zS = (e) => IS(e, sy),
  BS = q(2, (e, t) => IS(e, (e) => yS(db(() => t(e))))),
  VS = (e) => e._tag === `Success`,
  HS = (e) => e._tag === `Failure`,
  US = (e) => e._tag === `Failure` && rS(e.cause),
  WS = Gb(void 0),
  GS = (e) => {
    let t = [];
    for (let n of e) n._tag === `Failure` && t.push(...n.cause.reasons);
    return t.length === 0 ? WS : Jb(Nb(t));
  },
  KS = q(2, (e, t) =>
    Zb((n) => {
      let r = n.context, i = t(r);
      return r === i ? e : (n.setContext(i),
        fC(e, () => {
          n.setContext(r);
        }));
    })),
  qS = q(2, (e, t) => RS(e) ? e : KS(e, zx(t))),
  JS = function () {
    return arguments.length === 1
      ? q(2, (e, t) => YS(e, arguments[0], t))
      : q(3, (e, t, n) => YS(e, t, n)).apply(this, arguments);
  },
  YS = (e, t, n) => KS(e, jx(t, n)),
  XS = q(2, (e, t) => {
    let n = Object.create(ZS);
    return n[J] = e, n[vb] = t.length === 1 ? t : (e) => t(e), n;
  }),
  ZS = Hb({
    op: `OnFailure`,
    [gb](e) {
      return e._stack.push(this), this[J];
    },
  }),
  QS = (e) => RS(e) ? Gb(e) : $S(e),
  $S = Ub({
    op: `Exit`,
    [gb](e) {
      return e._stack.push(this), this[J];
    },
    [_b](e, t, n) {
      return yS(n ?? Gb(e));
    },
    [vb](e, t, n) {
      return yS(n ?? Jb(e));
    },
  }),
  eC = `~effect/Scope`,
  tC = `~effect/Scope/Closeable`,
  nC = (e, t) => SS(() => rC(e, t) ?? TS),
  rC = (e, t) => {
    if (e.state._tag === `Closed`) return;
    let n = { _tag: `Closed`, exit: t };
    if (e.state._tag === `Empty`) {
      e.state = n;
      return;
    }
    let { finalizers: r } = e.state;
    if (e.state = n, r.size !== 0) {
      return r.size === 1 ? r.values().next().value(t) : aC(e, r, t);
    }
  },
  iC = (e, t) => VS(e) ? t : XS(t, (t) => bS(iS(e.cause, t))),
  aC = kS(function* (e, t, n) {
    let r = [], i = [], a = Array.from(t.values()), o = uS();
    for (let t = a.length - 1; t >= 0; t--) {
      let s = a[t];
      e.strategy === `sequential`
        ? r.push(yield* QS(s(n)))
        : i.push(hC(o, s(n), !0, !0, `inherit`));
    }
    return i.length > 0 && (r = yield* gS(i)), yield* GS(r);
  }),
  oC = (e, t) => {
    let n = uC(t);
    if (e.state._tag === `Closed`) return n.state = e.state, n;
    let r = {};
    return cC(e, r, (e) => nC(n, e)), cC(n, r, (t) => xS(() => lC(e, r))), n;
  },
  sC = (e, t) =>
    SS(() => e.state._tag === `Closed` ? t(e.state.exit) : (cC(e, {}, t), TS)),
  cC = (e, t, n) => {
    e.state._tag === `Empty`
      ? e.state = { _tag: `Open`, finalizers: new Map([[t, n]]) }
      : e.state._tag === `Open` && e.state.finalizers.set(t, n);
  },
  lC = (e, t) => {
    e.state._tag === `Open` && e.state.finalizers.delete(t);
  },
  uC = (e = `sequential`) => ({ [tC]: tC, [eC]: eC, strategy: e, state: dC }),
  dC = { _tag: `Empty` },
  fC = Ub({
    op: `OnExit`,
    single: !1,
    [gb](e) {
      return e._stack.push(this), this[J][0];
    },
    [yb](e) {
      e.interruptible && this[J][2] !== !0 &&
        (e._stack.push(mC), e.interruptible = !1);
    },
    [_b](e, t, n) {
      n ??= Gb(e);
      let r = this[J][1](n);
      return r ? IS(r, (e) => n) : n;
    },
    [vb](e, t, n) {
      n ??= Jb(e);
      let r = this[J][1](n);
      return r ? IS(iC(n, r), (e) => n) : n;
    },
  }),
  pC = q(2, fC),
  mC = Ub({
    op: `SetInterruptible`,
    [yb](e) {
      if (
        e.interruptible = this[J], e._interruptedCause && e.interruptible
      ) return () => bS(e._interruptedCause);
    },
  })(!0),
  hC = (e, t, n = !1, r = !1, i = !1) => {
    let a = e,
      o = i === `inherit` ? a.interruptible : !i,
      s = new dS(a.context, o);
    return n
      ? s.evaluate(t)
      : a.currentDispatcher.scheduleTask(() => s.evaluate(t), 0),
      !r && !s._exit &&
      (a.children().add(s), s.addObserver(() => a._children.delete(s))),
      s;
  },
  gC = (e) => (t, n) => {
    let r = new dS(
      n?.scheduler ? jx(e, Vx, n.scheduler) : e,
      n?.uninterruptible !== !0,
    );
    if (r.evaluate(t), r._exit) return r;
    if (n?.signal) {
      if (n.signal.aborted) r.interruptUnsafe();
      else {
        let e = () => r.interruptUnsafe();
        n.signal.addEventListener(`abort`, e, { once: !0 }),
          r.addObserver(() => n.signal.removeEventListener(`abort`, e));
      }
    }
    return n?.onFiberStart && n.onFiberStart(r), r;
  },
  _C = q(2, (e, t) => {
    if (e._exit) return e;
    if (t.state._tag === `Closed`) return e.interruptUnsafe(e.id), e;
    let n = {};
    return cC(t, n, () => _S(e)), e.addObserver(() => lC(t, n)), e;
  }),
  vC = gC(Ox()),
  yC = (e) => {
    let t = gC(e);
    return (e, n) => {
      let r = t(e, n);
      return n?.onExit && r.addObserver(n.onExit), (e) => r.interruptUnsafe(e);
    };
  },
  bC = yC(Ox()),
  xC = (e) => {
    let t = gC(e);
    return (e, n) => {
      let r = t(e, n);
      return new Promise((e) => {
        r.addObserver((t) => e(t));
      });
    };
  },
  SC = xC(Ox()),
  CC = (e) => {
    let t = xC(e);
    return (e, n) =>
      t(e, n).then((e) => {
        if (e._tag === `Failure`) throw oS(e.cause);
        return e.value;
      });
  },
  wC = CC(Ox()),
  TC = (e) => {
    let t = gC(e);
    return (e) => {
      if (RS(e)) return e;
      let n = new Gx(`sync`), r = t(e, { scheduler: n });
      return r._dispatcher?.flush(), r._exit ?? Xb(new AC(r));
    };
  },
  EC = TC(Ox()),
  DC = (e) => {
    let t = TC(e);
    return (e) => {
      let n = t(e);
      if (n._tag === `Failure`) throw oS(n.cause);
      return n.value;
    };
  },
  OC = DC(Ox()),
  kC = `~effect/Cause/AsyncFiberError`,
  AC = class extends ex(`AsyncFiberError`) {
    [kC] = kC;
    constructor(e) {
      super({
        message: `An asynchronous Effect was executed with Effect.runSync`,
        fiber: e,
      });
    }
  },
  jC = {
    bold: `1`,
    red: `31`,
    green: `32`,
    yellow: `33`,
    blue: `34`,
    cyan: `36`,
    white: `37`,
    gray: `90`,
    black: `30`,
    bgBrightRed: `101`,
  };
jC.gray, jC.blue, jC.green, jC.yellow, jC.red, jC.bgBrightRed, jC.black;
var MC = oS,
  NC = WS,
  PC = VS,
  FC = HS,
  IC = US,
  LC = {
    "~effect/Deferred": { _A: sy, _E: sy },
    pipe() {
      return oy(this, arguments);
    },
  },
  RC = () => {
    let e = Object.create(LC);
    return e.resumes = void 0, e.effect = void 0, e;
  },
  zC = (e) =>
    OS((t) =>
      e.effect ? t(e.effect) : (e.resumes ??= [],
        e.resumes.push(t),
        xS(() => {
          let n = e.resumes;
          if (n === void 0) return;
          let r = n.indexOf(t);
          r >= 0 && n.splice(r, 1);
        }))
    ),
  BC = q(2, (e, t) => xS(() => VC(e, t))),
  VC = (e, t) => {
    if (e.effect) return !1;
    if (e.effect = t, e.resumes) {
      let n = e.resumes;
      e.resumes = void 0;
      for (let e = 0; e < n.length; e++) n[e](t);
    }
    return !0;
  },
  HC = uC,
  UC = oC,
  WC = nC,
  GC = `~effect/Layer/MemoMap`,
  KC = (e, t) => (e.observers++, NS(sC(t, (t) => e.finalizer(t)), e.effect)),
  qC = (e, t, n, r) => {
    let i = HC(),
      a = RC(),
      o = {
        observers: 1,
        effect: zC(a),
        finalizer: (n) =>
          SS(
            () => (o.observers--,
              o.observers === 0 ? (e.map.delete(t), WC(i, n)) : TS),
          ),
      };
    return e.map.set(t, o),
      sC(n, o.finalizer).pipe(
        IS(() => r(e, i)),
        pC((e) => (o.effect = e, BC(a, e))),
      );
  },
  JC = class {
    get [GC]() {
      return GC;
    }
    parent;
    constructor(e) {
      this.parent = e;
    }
    map = new Map();
    get(e, t) {
      let n = this.map.get(e);
      return n ? KC(n, t) : this.parent?.get(e, t);
    }
    getOrElseMemoize(e, t, n) {
      return SS(() => this.get(e, t) || qC(this, e, t, n));
    }
  },
  YC = () => new JC(),
  XC = (e) => new JC(e),
  ZC = class e extends ux()(`effect/Layer/CurrentMemoMap`) {
    static forkOrCreate(t) {
      let n = Nx(t, e);
      return n ? XC(n) : YC();
    }
  },
  QC = q(3, (e, t, n) => JS(BS(e.build(t, n), jx(ZC, t)), ZC, t)),
  $C = SS,
  ew = xS,
  tw = wS,
  nw = Zb,
  rw = IS,
  iw = zS,
  aw = PS,
  ow = qS,
  sw = vC,
  cw = gC,
  lw = yC,
  uw = bC,
  dw = wC,
  fw = CC,
  pw = SC,
  mw = xC,
  hw = OC,
  gw = DC,
  _w = EC,
  vw = TC,
  yw = hS,
  bw = _S,
  xw = _C,
  Sw = `~effect/ManagedRuntime`,
  Cw = (e, t) => {
    let n = t?.memoMap ?? YC(),
      r = HC(`parallel`),
      i = UC(r, `sequential`),
      a = { onFiberStart: xw(r) },
      o = (e) =>
        e
          ? {
            ...e,
            onFiberStart: e.onFiberStart
              ? (t) => {
                a.onFiberStart(t), e.onFiberStart(t);
              }
              : a.onFiberStart,
          }
          : a,
      s,
      c = nw((t) => (s ||= sw(
        aw(QC(e, n, i), (e) =>
          ew(() => {
            l.cachedContext = e;
          })),
        { ...a, scheduler: t.currentScheduler },
      ),
        iw(yw(s)))
      ),
      l = {
        [Sw]: Sw,
        memoMap: n,
        scope: r,
        contextEffect: c,
        cachedContext: void 0,
        context() {
          return l.cachedContext === void 0
            ? dw(l.contextEffect)
            : Promise.resolve(l.cachedContext);
        },
        dispose() {
          return dw(l.disposeEffect);
        },
        [Symbol.asyncDispose]() {
          return l.dispose();
        },
        disposeEffect: $C(
          () => (l.contextEffect = tw(`ManagedRuntime disposed`),
            l.cachedContext = void 0,
            WC(l.scope, NC)),
        ),
        runFork(e, t) {
          return l.cachedContext === void 0
            ? sw(ww(l, e), o(t))
            : cw(l.cachedContext)(e, o(t));
        },
        runCallback(e, t) {
          return l.cachedContext === void 0
            ? uw(ww(l, e), o(t))
            : lw(l.cachedContext)(e, o(t));
        },
        runSyncExit(e) {
          return l.cachedContext === void 0
            ? _w(ww(l, e))
            : vw(l.cachedContext)(e);
        },
        runSync(e) {
          return l.cachedContext === void 0
            ? hw(ww(l, e))
            : gw(l.cachedContext)(e);
        },
        runPromiseExit(e, t) {
          return l.cachedContext === void 0
            ? pw(ww(l, e), o(t))
            : mw(l.cachedContext)(e, o(t));
        },
        runPromise(e, t) {
          return l.cachedContext === void 0
            ? dw(ww(l, e), o(t))
            : fw(l.cachedContext)(e, o(t));
        },
      };
    return l;
  };
function ww(e, t) {
  return rw(e.contextEffect, (e) => ow(t, e));
}
var Tw = class extends Error {
    source;
    constructor(e) {
      let t = Error, n = t.stackTraceLimit;
      n !== void 0 && (t.stackTraceLimit = 0),
        super(),
        n !== void 0 && (t.stackTraceLimit = n),
        this.source = e;
    }
  },
  Ew = class extends Error {
    source;
    constructor(e, t) {
      super(t instanceof Error ? t.message : String(t), { cause: t }),
        this.source = e;
    }
  },
  Dw = class extends Error {
    constructor() {
      super(``);
    }
  },
  Ow = class extends Error {
    constructor() {
      super(``);
    }
  },
  kw = 1024,
  Aw = 2048,
  jw = 4096,
  Mw = 1024,
  Nw = 16384,
  Pw = 1 << 17,
  Y = {},
  Fw = {};
function Iw(e) {
  return e === Fw ? void 0 : e;
}
var Lw = {}, Rw = Symbol(`refresh`), zw = new Set();
function Bw(e) {
  for (; e.rn;) e = e.rn;
  return e;
}
function Vw(e, t) {
  if (e = Bw(e), t = Bw(t), e === t) return e;
  t.rn = e;
  for (let n of t.Oe) e.Oe.add(n);
  return t.Oe.clear(),
    e.tn[0].push(...t.tn[0]),
    e.tn[1].push(...t.tn[1]),
    t.tn[0].length = 0,
    t.tn[1].length = 0,
    e;
}
function Hw(e) {
  let t = e.o?.Je;
  if (!t) return;
  let n = Bw(t);
  if (zw.has(n)) return n;
  e.o !== null && (e.o.Je = void 0);
}
function Uw(e) {
  if (Ww(e) && e.o?.Nt) {
    let t = EE(e).Nt = ET(e.o?.Nt);
    if (t.sn !== !0) return t;
    e.o !== null && (e.o.Nt = null);
  }
  return Hw(e)?.Ae ?? e.Ae;
}
function Ww(e) {
  let t = e.o;
  return t !== null && t.Pe !== void 0 && t.Pe !== Y;
}
function Gw(e, t) {
  let n = Bw(t), r = e.o?.Je;
  if (r) {
    if (r.rn) {
      EE(e).Je = t, e.T |= Mw;
      return;
    }
    let i = Bw(r);
    if (zw.has(i)) {
      i !== n && !Ww(e) &&
        (n.an && Bw(n.an) === i
          ? (EE(e).Je = t, e.T |= Mw)
          : i.an && Bw(i.an) === n || Vw(n, i));
      return;
    }
  }
  EE(e).Je = t, e.T |= Mw;
}
var Kw = new Set(),
  qw = { eE: Array(2e3).fill(void 0), tE: !1, Qe: 0, EE: 0 },
  Jw = { eE: Array(2e3).fill(void 0), tE: !1, Qe: 0, EE: 0 };
function Yw(e) {
  e.ie & 16 ? e.ie &= -12 : (NT(e, Jw), e.ie &= -4);
}
var Xw = 0, X = null, Zw = !1, Qw = 0, $w = new Set();
function eT(e) {
  let t = e.m;
  return Kw.size === 0 && zw.size === 0 && e.Qt.length === 0 &&
    t.ze.length === 0 && t.A.length === 0 && t.En.size === 0 && $w.size === 0;
}
function tT() {
  if ($w.size !== 0) {
    for (let e of $w) {
      if (e.u !== null) {
        $w.delete(e);
        continue;
      }
      e.Re === Y && (e.o?.Pe === void 0 || e.o?.Pe === Y) &&
        (e.o?.t || ($w.delete(e), e.o?.Et?.()));
    }
  }
}
function nT() {
  return {
    Te: Xw,
    Lt: [],
    _e: new Map(),
    ze: [],
    A: [],
    En: new Set(),
    ue: [],
    Bt: { Mt: [[], []], Qt: [] },
    sn: !1,
    cn: new Set(),
  };
}
function rT(e, t) {
  t.sn = e, e.ue.push(...t.ue);
  for (let n of zw) n.Ae === t && (n.Ae = e);
  t.ze.length && (e.ze.push(...t.ze), t.ze.length = 0),
    t.A.length && (e.A.push(...t.A), t.A.length = 0);
  for (let n of t.En) e.En.add(n);
  let n = t.wt;
  if (n !== void 0) {
    t.wt = void 0;
    let r = e.wt;
    r === void 0 ? r = e.wt = n : r.push(...n);
    for (let e = 0; e < n.length; e++) {
      let t = n[e].pc;
      t !== void 0 && t.qe === n[e] && (t.qa = r);
    }
  }
  for (let [n, r] of t._e) {
    let t = e._e.get(n);
    t || e._e.set(n, t = new Set());
    for (let e of r) t.add(e);
  }
  for (let n of t.cn) e.cn.add(n);
}
function iT() {
  Zw || (Zw = !0, !Qw && !bT.fn && queueMicrotask(ST));
}
var aT = 0,
  oT = class {
    ke = null;
    Mt = [[], []];
    Qt = [];
    jt = 0;
    created = Xw;
    addChild(e) {
      this.Qt.push(e), e.ke = this;
    }
    removeChild(e) {
      let t = this.Qt.indexOf(e);
      t >= 0 && (this.Qt.splice(t, 1), e.ke = null);
    }
    notify(e, t, n, r) {
      return this.ke ? this.ke.notify(e, t, n, r) : !1;
    }
    run(e) {
      if (this.Mt[e - 1].length) {
        let t = this.Mt[e - 1];
        this.Mt[e - 1] = [], CT(t, e);
      }
      let t = this.Qt, n = ++aT;
      for (let r = 0; r < t.length;) {
        let i = t[r];
        if (i.jt !== n && (i.jt = n, i.run?.(e), t[r] !== i)) {
          r = 0;
          continue;
        }
        r++;
      }
    }
    enqueue(e, t) {
      e && (SE ? Bw(SE).tn[e - 1].push(t) : this.Mt[e - 1].push(t)), iT();
    }
    stashQueues(e) {
      e.Mt[0].push(...this.Mt[0]),
        e.Mt[1].push(...this.Mt[1]),
        this.Mt = [[], []];
      for (let t = 0; t < this.Qt.length; t++) {
        let n = this.Qt[t], r = e.Qt[t];
        r || (r = { Mt: [[], []], Qt: [] }, e.Qt[t] = r), n.stashQueues(r);
      }
    }
    restoreQueues(e) {
      this.Mt[0].push(...e.Mt[0]), this.Mt[1].push(...e.Mt[1]);
      for (let t = 0; t < e.Qt.length; t++) {
        let n = e.Qt[t], r = this.Qt[t];
        r && r.restoreQueues(n);
      }
    }
  },
  Z = class e extends oT {
    fn = !1;
    m = nT();
    static Fe;
    static He;
    static it;
    static qt = null;
    static p = null;
    static G = null;
    static M = null;
    static N = null;
    static Pt = null;
    static ht = null;
    static Ue = null;
    static de = null;
    static me = null;
    static un = null;
    static gt = null;
    static Ht = null;
    static kt = null;
    static et = null;
    static k = null;
    static Wt = null;
    static zt = null;
    static xt = null;
    static Tn = null;
    static dn = null;
    static In = null;
    static Nn = null;
    static ln = null;
    static vt = null;
    static Vt = null;
    static bt = null;
    static Be = null;
    static $e = null;
    static he = null;
    static Xe = null;
    static _n = null;
    flush() {
      if (!this.fn) {
        if (
          X === null && qw.EE < qw.Qe && this.Mt[0].length === 0 &&
          this.Mt[1].length === 0 && this.Qt.length === 0 && eT(this)
        ) {
          this.fn = !0;
          try {
            tE(), gT();
          } finally {
            this.fn = !1;
          }
          Xw++,
            Zw = qw.EE >= qw.Qe || this.Mt[0].length !== 0 ||
              this.Mt[1].length !== 0 || this.m.Lt.length !== 0;
          return;
        }
        this.fn = !0;
        try {
          if (tE(), IT(qw, e.Fe), X) {
            if (!TT(X)) {
              let t = X;
              IT(Jw, this.m === t ? Yw : e.Fe),
                this.m === t && (xT = this.m = nT()),
                zw.size && (e.Nn(1), e.Nn(2)),
                this.stashQueues(t.Bt),
                Xw++,
                Zw = qw.EE >= qw.Qe || this.m.Lt.length > 0,
                yT(t.Lt),
                X = null,
                _T(null, !0);
              return;
            }
            let t = X, n = this.m;
            if (
              n !== t && n.Lt.push(...t.Lt),
                this.restoreQueues(t.Bt),
                Kw.delete(t),
                X = null,
                yT(n.Lt),
                _T(t),
                n === t
            ) {
              let e = nT();
              e.Lt = n.Lt, e.ze = n.ze, e.A = n.A, e.En = n.En, xT = this.m = e;
            }
          } else {eT(this)
              ? (gT(), qw.EE >= qw.Qe && (IT(qw, e.Fe), gT()))
              : (Kw.size && IT(Jw, e.Fe), _T());}
          Xw++,
            Zw = qw.EE >= qw.Qe,
            zw.size && e.Nn(1),
            this.run(1),
            zw.size && e.Nn(2),
            this.run(2);
        } finally {
          this.fn = !1;
        }
      }
    }
    notify(t, n, r, i) {
      if (n & 1) {
        if (r & 1) {
          let n = i === void 0 ? t.o?._ : i;
          if (n?.l) return !0;
          if (X && n) {
            let r = n.source, i = X._e.get(r);
            i || X._e.set(r, i = new Set());
            let a = i.size;
            i.add(t), i.size !== a && (iT(), e.zt?.(X));
          }
        }
        return !0;
      }
      return !1;
    }
    initTransition(e) {
      if (e && (e = ET(e), e.sn === !0 || e === X) || !e && X && X.Te === Xw) {
        return;
      }
      if (!X) X = e ?? nT();
      else if (e) {
        let t = X;
        rT(e, t), Kw.delete(t), X = e;
      }
      Kw.add(X), X.Te = Xw;
      let t = this.m;
      if (t !== X) {
        for (let e = 0; e < t.Lt.length; e++) {
          let n = t.Lt[e];
          n.Ae = X, X.Lt.push(n);
        }
        for (let e = 0; e < t.ze.length; e++) {
          let n = t.ze[e];
          n.Ae = X, X.ze.push(n);
        }
        t.A.length && X.A.push(...t.A);
        for (let e of t.En) X.En.add(e);
        if (t.cn.size) {
          for (let e of t.cn) X.cn.add(e);
          t.cn.clear();
        }
        xT = this.m = X;
      }
      for (let e of zw) e.Ae ||= X;
      iT();
    }
  };
function sT(e) {
  xT.Lt.push(e);
}
var cT = !1, lT = 0;
function uT() {
  lT++;
}
function dT(e, t = !1) {
  e.It = lT;
  let n = e.T,
    r = (n & 1024 ? e.o?.Je : void 0) || SE,
    i = !!(n & 512) && e.o?.We !== void 0,
    a = cT;
  for (let n = e.u; n !== null; n = n.ae) {
    let e = n.ce;
    if (
      a && (e.ie &= ~Aw),
        e.ie & 4 && n.Ft === e.Ke && n !== e.je && (e.ie |= jw),
        i && e.T & 8
    ) {
      e.ie |= 256;
      continue;
    }
    t && r
      ? (e.ie |= 128, Gw(e, r))
      : t && (e.ie |= 128, e.o && (e.o.Je = void 0)), kT(e);
  }
}
function fT(e) {
  let t = e;
  if (!t.oe) {
    e.Re !== Y && (e.be = e.Re, e.Re = Y), e.T & 256 && Z.un(e);
    return;
  }
  e.Re !== Y &&
  (e.be = e.Re,
    e.Re = Y,
    e.ge && e.ge !== 3 && (e.tt = !0),
    e.o && (e.o.De = !1)),
    t.Ne = !1,
    t.ie &= ~kw,
    t.S & 1 || (t.S &= -5),
    t.o != null && (t.o.Ye !== null || t.o.qe !== null) && Z.He(t, !1, !0),
    e.T & 256 && Z.un(e);
}
var pT = null, mT = null, hT = [];
function gT() {
  let e = xT.Lt;
  for (let t = 0; t < e.length; t++) {
    let n = e[t];
    fT(n), n.Ae = null, n.T & 131072 && (n.T &= ~Pw, hT.push(n));
  }
  e.length = 0, pT?.(), mT?.(xT);
}
function _T(e = null, t = !1) {
  let n = !t;
  n && gT(), !t && bT.Qt.length && vT(bT);
  let r = qw.EE >= qw.Qe;
  if (r && IT(qw, Z.Fe), n) {
    r && gT();
    let t = e ?? bT.m;
    if (t.ze.length && Z.Tn(t.ze), t.cn.size) {
      for (let e of t.cn) e.ie & 64 || kT(e);
      t.cn.clear(), iT();
    }
    if (
      t.A.length && (Z.G(t.A), bT.Qt.length && vT(bT)),
        t.En.size && Z.qt(t.En, e),
        hT.length !== 0
    ) {
      for (; hT.length;) dT(hT.pop());
      qw.EE >= qw.Qe && (IT(qw, Z.Fe), gT());
    }
    tT(), zw.size && Z.In(e);
  }
}
function vT(e) {
  for (let t of e.Qt) t.se?.(), vT(t);
}
function yT(e) {
  for (let t = 0; t < e.length; t++) e[t].Ae = X;
}
var bT = new Z(), xT = bT.m;
function ST(e) {
  if (e) {
    Qw++;
    try {
      return e();
    } finally {
      try {
        ST();
      } finally {
        Qw--;
      }
    }
  }
  if (!bT.fn) { for (; Zw || X;) bT.flush(); }
}
function CT(e, t) {
  for (let n = 0; n < e.length; n++) e[n](t);
}
function wT(e, t) {
  if (e.ie & 96) return !1;
  if (e.o?.le?.has(t)) return !0;
  for (let n = e.ut; n; n = n.lt) {
    let e = n.ot;
    for (; e;) {
      if (e === t || e.st === t) return !0;
      e = e.o?.Tt;
    }
  }
  return !!(e.S & 1 && e.o?._ instanceof Tw && e.o?._.source === t);
}
function TT(e) {
  if (e.sn) return !0;
  if (e.ue.length) return !1;
  let t = !0;
  for (let [n, r] of e._e) {
    let i = !1;
    for (let e of r) {
      if (wT(e, n)) {
        i = !0;
        break;
      }
      r.delete(e);
    }
    if (!i) e._e.delete(n);
    else if (n.S & 1 && n.o?._?.source === n) {
      t = !1;
      break;
    }
  }
  return t && Z.dn?.(e) && (t = !1), t && (e.sn = !0), t;
}
function ET(e) {
  for (; e.sn && typeof e.sn == `object`;) e = e.sn;
  return e;
}
function DT(e, t) {
  let n = X;
  try {
    return X = ET(e), t();
  } finally {
    X = n;
  }
}
function OT(e) {
  return e.ie & 32 ? Jw : qw;
}
function kT(e) {
  if (e.ge === 3) {
    let t = e;
    t.tt || (t.tt = !0, t.C.enqueue(2, t.yt));
    return;
  }
  let t = OT(e);
  t.Qe > e.Me && (t.Qe = e.Me), jT(e, t);
}
function AT(e, t) {
  let n = (e.ke?.Gt ? e.ke.Dt?.Me : e.ke?.Me) ?? -1;
  n >= e.Me && (e.Me = n + 1);
  let r = e.Me, i = t.eE[r];
  if (i === void 0) t.eE[r] = e;
  else {
    let t = i.ct;
    t.rt = e, e.ct = t, i.ct = e;
  }
  r > t.EE && (t.EE = r);
}
function jT(e, t) {
  let n = e.ie;
  n & 1036 ||
    (n & 1
      ? e.ie = n & -4 | 10
      : (e.ie = n | 8, t.tE && !(n & 2) && (t.tE = !1)),
      n & 16 || AT(e, t));
}
function MT(e, t) {
  let n = e.ie;
  n & 1052 || (e.ie = n | 16, AT(e, t));
}
function NT(e, t) {
  let n = e.ie;
  if (!(n & 24)) return;
  e.ie = n & -25;
  let r = e.Me;
  if (e.ct === e) t.eE[r] = void 0;
  else {
    let n = e.rt, i = t.eE[r], a = n ?? i;
    e === i ? t.eE[r] = n : e.ct.rt = n, a.ct = e.ct;
  }
  e.ct = e, e.rt = void 0;
}
function PT(e) {
  if (!e.tE) {
    e.tE = !0;
    for (let t = 0; t <= e.EE; t++) {
      for (let n = e.eE[t]; n !== void 0; n = n.rt) {
        n.ie & 8 && FT(n);
      }
    }
  }
}
function FT(e, t = 2) {
  let n = e.ie;
  if (!((n & 3) >= t)) {
    e.ie = n & -4 | t;
    for (let t = e.u; t !== null; t = t.ae) FT(t.ce, 1);
    if (e.T & 4096) {
      for (let t = e.o.i; t !== null; t = t.Se) {
        for (let e = t.u; e !== null; e = e.ae) FT(e.ce, 1);
      }
    }
  }
}
function IT(e, t) {
  for (e.tE = !1, e.Qe = 0; e.Qe <= e.EE; e.Qe++) {
    let n = e.eE[e.Qe];
    for (; n !== void 0;) n.ie & 8 ? t(n) : LT(n, e), n = e.eE[e.Qe];
  }
  e.EE = 0;
}
function LT(e, t) {
  NT(e, t);
  let n = e.Me;
  for (let t = e.ut; t; t = t.lt) {
    let e = t.ot, r = e.st || e;
    r.oe && r.Me >= n && (n = r.Me + 1);
  }
  if (e.Me !== n) {
    e.Me = n;
    for (let t = e.u; t !== null; t = t.ae) MT(t.ce, OT(t.ce));
  }
}
function RT(e) {
  let t = e.xe;
  for (; t;) {
    let e = t.ie;
    t.ie = e | 32,
      e & 24 && (NT(t, e & 32 ? Jw : qw), e & 8 ? jT(t, Jw) : MT(t, Jw)),
      RT(t),
      t = t.Le;
  }
}
function zT(e, t = !1, n) {
  let r = e.ie;
  if (r & 64) return;
  if (t) {
    e.ie = r | 64;
    let t = e;
    (t.o?.ye || t.o?.Ce) && Z.un(t);
  }
  t && e.oe && e.o !== null && (e.o.Ie = null);
  let i = n ? e.o?.Ye ?? null : e.xe;
  for (; i;) {
    let e = i.Le, t = i;
    t.T &= -33, NT(t, OT(t)), QT(t), zT(i, !0), i = e;
  }
  if (
    n ? e.o !== null && (e.o.Ye = null) : (e.xe = null, e.Ze = 0),
      t && !n && !(r & 32) && e.ke !== null && !(e.ke.ie & 64)
  ) {
    let t = e.ft, n = e.Le;
    t === null ? e.ke.xe = n : t.Le = n, n !== null && (n.ft = t), e.ft = null;
  }
  if (BT(e, n), t && e.Rt) {
    let t = e.Rt;
    e.Rt = void 0, t();
  }
}
function BT(e, t) {
  let n = t ? e.o?.qe : e.Ge;
  if (n) {
    if (Array.isArray(n)) {
      for (let e = 0; e < n.length; e++) {
        let t = n[e];
        t.call(t);
      }
    } else n.call(n);
    t ? e.o !== null && (e.o.qe = null) : e.Ge = null;
  }
}
function VT(e, t) {
  let n = e;
  for (; n.T & 4 && n.ke;) n = n.ke;
  if (n.id != null) return WT(n.id, t ? n.Ze++ : n.Ze);
  throw Error(``);
}
function HT(e) {
  return VT(e, !0);
}
function UT(e, t, n) {
  return e?.id ?? (t ? n?.id : n?.id == null ? void 0 : HT(n));
}
function WT(e, t) {
  let n = t.toString(36), r = n.length - 1;
  return e + (r ? String.fromCharCode(64 + r) : ``) + n;
}
function GT() {
  return Q;
}
function KT(e) {
  return Q &&
    (Q.Ge ? Array.isArray(Q.Ge) ? Q.Ge.push(e) : Q.Ge = [Q.Ge, e] : Q.Ge = e),
    e;
}
function qT(e = !0) {
  zT(this, e);
}
function JT(e) {
  let t = Q,
    n = e?.transparent ?? !1,
    r = {
      id: UT(e, n, t),
      T: n ? 4 : 0,
      Gt: !0,
      Dt: t?.Gt ? t.Dt : t,
      xe: null,
      Le: null,
      ft: null,
      Ge: null,
      C: t?.C ?? bT,
      we: t?.we || Lw,
      Ze: 0,
      o: null,
      ke: t,
      dispose: qT,
    };
  if (t) {
    let e = t.xe;
    e === null ? t.xe = r : (r.Le = e, e.ft = r, t.xe = r);
  }
  return r;
}
function YT(e, t) {
  let n = JT(t);
  return FE(n, () => e(() => n.dispose()));
}
function XT(e) {
  let t = e.ot, n = e.lt, r = e.ae, i = e.en;
  if (r === null ? t._t = i : r.en = i, i !== null) i.ae = r;
  else if (t.u = r, r === null) {
    t.o?.Et?.();
    let e = t;
    e.oe && e.T & 32 && !(e.ie & 32) && !(e.S & 1) && $T(e);
  }
  return n;
}
function ZT(e) {
  let t = e.je, n = t === null ? e.ut : t.lt;
  if (n !== null) {
    do n = XT(n); while (n !== null);
    t === null ? e.ut = null : t.lt = null;
  }
}
function QT(e) {
  let t = e.ut;
  if (t) {
    do t = XT(t); while (t !== null);
    e.ut = null, e.je = null;
  }
}
function $T(e) {
  NT(e, OT(e)), QT(e), zT(e, !0);
}
var eE = new Set();
function tE() {
  if (eE.size !== 0) {
    for (let e of eE) !e.u && e.T & 32 && !(e.S & 1) && !(e.ie & 96) && $T(e);
    eE.clear();
  }
}
function nE(e, t, n = !1) {
  let r = t.je;
  if (r !== null && r.ot === e) {
    r.ve &&= n;
    return;
  }
  let i = null, a = t.ie & 4;
  if (a && (i = r === null ? t.ut : r.lt, i !== null && i.ot === e)) {
    i.Ft = t.Ke, t.je = i, i.ve = n;
    return;
  }
  let o = e._t;
  if (o !== null && o.ce === t && (!a || o.Ft === t.Ke)) {
    a ? o.ve &&= n : o.ve = n;
    return;
  }
  let s = t.je = e._t = {
    ot: e,
    ce: t,
    lt: i,
    en: o,
    ae: null,
    Ft: t.Ke,
    ve: n,
  };
  r === null ? t.ut = s : r.lt = s, o === null ? e.u = s : o.ae = s, uT();
}
function rE(e, t) {
  return !e.o?.le?.has(t) && ((EE(e).le ??= new Set()).add(t), !0);
}
function iE(e, t) {
  let n = e.o?.le;
  return n?.delete(t) ? (n.size || (e.o.le = void 0), !0) : !1;
}
function aE(e) {
  e.o !== null && (e.o.le = void 0);
}
function oE(e, t) {
  EE(e).fe = !0, t.source && rE(e, t.source), e.S & 2 || sE(e, t.source, t);
}
function sE(e, t, n) {
  if (!t) {
    e.o !== null && (e.o._ = null);
    return;
  }
  if (n instanceof Tw && n.source === t) {
    EE(e)._ = n;
    return;
  }
  let r = e.o?._;
  (!(r instanceof Tw) || r.source !== t) && (EE(e)._ = new Tw(t));
}
function cE(e, t) {
  for (let n = e.u; n !== null; n = n.ae) t(n.ce, n);
  for (let n = e.o?.i ?? null; n !== null; n = n.Se) {
    for (let e = n.u; e !== null; e = e.ae) {
      t(e.ce, e);
    }
  }
}
function lE(e) {
  e.oe && e.T & 32 && !e.u && !(e.ie & 32) && !(e.S & 1) && $T(e);
}
function uE(e) {
  let t,
    n = new Set(),
    r = (e) => {
      n.has(e) || (n.add(e), !e.u && e.T & 32 && (t ??= []).push(e), cE(e, r));
    };
  if (cE(e, r), t) { for (let e of t) lE(e); }
}
function dE(e, t) {
  let n = !1,
    r = new Set(),
    i = (e) => {
      r.has(e) || (r.add(e), e.o?._ === t && (kT(e), n = !0), cE(e, i));
    };
  cE(e, i), n && iT();
}
function fE(e) {
  iE(e, e);
  let t = !1,
    n,
    r = new Set(),
    i = Z.de,
    a = (o) => {
      if (r.has(o) || !iE(o, e)) return;
      r.add(o), o.Te = Xw;
      let s = o.o?.le?.values().next().value, c = o.S & 2;
      s
        ? (c || sE(o, s), i?.(o))
        : (o.S &= -2,
          c || sE(o),
          i?.(o),
          o.o?.fe && (kT(o), t = !0),
          o.o !== null && (o.o.fe = !1),
          !o.u && o.T & 32 && (n ??= []).push(o)), cE(o, a);
    };
  if (cE(e, a), n) { for (let e of n) lE(e); }
  t && iT();
}
function pE(e) {
  return typeof e == `object` && !!e && typeof e.then == `function`;
}
function mE(e) {
  let t = e.o?.Ee;
  t != null && (e.o.Ee = null, t());
}
function hE(e, t, n) {
  let r = !1, i = !1;
  if (
    typeof t == `object` && t && jE(() => {
      r = t[Symbol.asyncIterator], i = !r && pE(t);
    }), !i && !r
  ) return e.o !== null && (e.o.Ie = null), e.Ne = !1, t;
  EE(e).Ie = t;
  let a,
    o = () => {
      let t = Uw(e);
      if (t && e.S & 4 && !ET(t)._e.has(e)) {
        e.Ae = null;
        return;
      }
      bT.initTransition(t);
    },
    s = (n) => {
      if (e.o?.Ie !== t) return;
      let r = n instanceof Tw;
      if (r && e.Ne) {
        e.o !== null && (e.o.Ie = null), oE(e, n), e.Te = Xw;
        return;
      }
      o(), _E(e, r ? 1 : 2, n), r && fE(e), e.Te = Xw, r || uE(e);
    },
    c = (r, i) => {
      if (e.o?.Ie !== t || e.ie & 130) return;
      o();
      let a = !!(e.S & 4), s = e.o?.De;
      ZT(e), gE(e), s && (e.o.De = !0);
      let c = Hw(e);
      if (c && c.Oe.delete(e), n) n(r), a && gE(e, !0);
      else if (e.o?.Pe !== void 0) {
        e.Re === Y && sT(e),
          e.Re = r,
          Z.Ue?.(e, r),
          Ww(e) ? e.T & 16384 && Z.he?.(e) : dT(e),
          e.Te = Xw;
      } else if (c) {
        let t = e.ge, n = e.be, i = e.pe;
        try {
          (!t && a || !i || !i(r, n)) &&
            (e.be = r, e.Te = Xw, Z.Ue?.(e, r), dT(e, !0));
        } catch (t) {
          _E(e, 2, t);
        }
      } else {try {
          PE(e, () => r);
        } catch (t) {
          _E(e, 2, t);
        }}
      e.Re === Y && (e.Ne = !1, s && (e.o.De = !1)), fE(e), iT(), ST(), i?.();
    },
    l = () => e.T & 32 && !e.u && !(e.S & 1) ? ($T(e), !0) : !1,
    u = (n, r) => {
      let i = n[Symbol.asyncIterator](),
        o = !1,
        u = !1,
        d = !r,
        f = () => {
          if (!u) {
            u = !0;
            try {
              let e = i.return?.();
              pE(e) && e.then(void 0, () => {});
            } catch {}
          }
        };
      r ? r(f) : KT(f), EE(e).Ee = f;
      let p = () => {
          l() || m();
        },
        m = () => {
          let n, r, f = !1, h = !1, g = !0, _ = i.next();
          if (
            (pE(_) ? _ : { then: (e) => void e(_) }).then((r) => {
              if (g && d) n = r, f = !0, r.done && (u = !0);
              else if (e.o?.Ie !== t) return;
              else {r.done
                  ? (u = !0, o ? (iT(), ST()) : c(void 0), l())
                  : (o = !0, c(r.value, p));}
            }, (n) => {
              g && d ? (r = n, h = !0) : e.o?.Ie === t && (u = !0, s(n), l());
            }),
              g = !1,
              h
          ) {
            if (u = !0, s(r), d) throw r;
            return !0;
          }
          return f && !n.done ? (a = n.value, o = !0, m()) : f && n.done;
        },
        h = m();
      return d = !1, o || h;
    },
    d = null,
    f = (e, t) => {
      let n = !1;
      if (
        typeof e == `object` && e && jE(() => {
          n = e[Symbol.asyncIterator];
        }), !n
      ) return !1;
      let r = u(e, t);
      return t || (d = r), !0;
    };
  if (i) {
    let n = !1,
      r = !1,
      i,
      o = !0,
      u = (t) => {
        e.Ge ? Array.isArray(e.Ge) ? e.Ge.push(t) : e.Ge = [e.Ge, t] : e.Ge = t;
      };
    if (
      t.then((r) => {
        o
          ? (a = r, n = !0)
          : e.o?.Ie === t && !(e.ie & 64) && f(r, u) || (c(r), l());
      }, (e) => {
        o ? (i = e, r = !0) : (s(e), l());
      }),
        o = !1,
        r
    ) throw s(i), i;
    if (n) f(a) || (e.Ne = !1);
    else {
      if (e.Ne) return e.be;
      throw bT.initTransition(Uw(e)), new Tw(Q);
    }
  }
  if (r && f(t), d !== null) {
    if (!d) {
      if (e.Ne) return e.be;
      throw bT.initTransition(Uw(e)), new Tw(Q);
    }
    e.Ne = !1;
  }
  return a;
}
function gE(e, t = !1) {
  e.o?.le && aE(e),
    e.o?.fe && e.o !== null && (e.o.fe = !1),
    e.o !== null && (e.o.De = !1),
    e.S = t ? 0 : e.S & 4,
    e.o?._ && sE(e),
    (e.o?.ye || e.o?.Ce) && Z.de(e),
    e.o?.i && e.T & 2048 && Z.me !== null && Z.me(e);
  let n = OE(e);
  n && n.call(e);
}
function _E(e, t, n, r, i) {
  t === 2 && !(n instanceof Ew) && !(n instanceof Tw) && (n = new Ew(e, n));
  let a = t === 1 && n instanceof Tw ? n.source : void 0,
    o = a === e,
    s = t === 1 && e.o?.Pe !== void 0 && !o,
    c = s && Ww(e);
  r ||
  (t === 1 && a
    ? (rE(e, a), e.S = 1 | e.S & 4, sE(e, a, n))
    : (aE(e), e.S = t | (t === 2 ? 0 : e.S & 4), EE(e)._ = n),
    Z.de?.(e),
    e.o?.i && e.T & 2048 && Z.me !== null && Z.me(e)), i && !r && Gw(e, i);
  let l = r || c, u = r || s ? void 0 : i, d = OE(e);
  if (d) {
    if (r && t === 1) return;
    l ? d.call(e, t, n) : d.call(e);
    return;
  }
  cE(e, (e, r) => {
    if (
      e.Te = Xw,
        t === 1 && a && !e.o?.le?.has(a) || t !== 1 && (e.o?._ !== n || e.o?.le)
    ) {
      if (r.ve && t !== 1 && !(n instanceof Tw)) {
        kT(e), iT();
        return;
      }
      !l && !e.Ae && sT(e), _E(e, t, n, l, u);
    }
  });
}
Z.Fe = CE, Z.He = zT;
var vE = !1, yE = !1, bE = !1, xE = !1, Q = null, SE = null;
function CE(e, t = !1) {
  uT();
  let n = e.ge;
  if (!t) {
    if (
      e.Ae && (!n || X) && X !== e.Ae && bT.initTransition(e.Ae),
        NT(e, OT(e)),
        e.o !== null && (e.o.Ie = null, mE(e)),
        e.Ae || n === 3
    ) zT(e);
    else if (e.xe !== null || e.Ge !== null) {
      RT(e);
      let t = EE(e);
      t.qe = e.Ge, t.Ye = e.xe, e.Ge = null, e.xe = null, e.Ze = 0;
    }
  }
  let r = !!(e.ie & 128),
    i = !!(e.T & 128) && e.o?.Pe !== Y && e.o?.Pe !== void 0,
    a = !!(e.S & 4),
    o = e.S & 2 ? e.o?._ : void 0,
    s = e.o?.le?.has(e),
    c = (e.ie & Aw) !== 0,
    l = e.Ne,
    u = Q;
  Q = e, e.je = null, e.Ke++, e.ie = 4, e.Te = Xw;
  let d = e.Re === Y ? e.be : e.Re, f = e.Me, p = !1, m = vE, h = SE;
  vE = !0;
  let g = xE;
  if (xE = !1, r) {
    let t = Z.Be(e, !0);
    t ? SE = t : t === !1 && (r = !1);
  } else if (X && !t && X.ze.length) {
    let t = Z.Be(e, !1);
    t && (r = !0, SE = t);
  }
  let _ = n && n !== 2, v = yE;
  _ && (yE = !0);
  try {
    if (e.T & 64) d = e.oe(d), e.o !== null && (e.o.Ie = null), e.Ne = !1;
    else {
      let t = e.o?.Ie,
        n = e.oe(d),
        r = typeof n == `object` && !!n,
        i = e.o?.Ie !== t;
      d = i || !r ? n : hE(e, n),
        !i && !r && (e.o !== null && (e.o.Ie = null), e.Ne = !1);
    }
    (e.S !== 0 || e.o !== null) && gE(e, t), e.T & 1024 && e.o?.Je && Z.Xe(e);
  } catch (t) {
    let n = t instanceof Tw;
    if (n && e.Ne) oE(e, t);
    else {
      n && SE && Z.$e(e);
      let r = !1;
      n && (EE(e).fe = !0, Z.et !== null && (r = Z.et(e, c))),
        _E(e, n ? 1 : 2, t, void 0, n ? e.o?.Je : void 0),
        n && s && !e.o?.Ie && fE(e),
        r && Z.k(e);
    }
  } finally {
    vE = m,
      xE = g,
      _ && (yE = v),
      p = (e.ie & jw) !== 0,
      e.ie = 0 | (t ? e.ie & 256 : 0),
      Q = u;
  }
  if (!e.o?._) {
    ZT(e);
    let c = i ? Iw(e.o?.Pe) : e.Re === Y ? e.be : e.Re, u = !1;
    try {
      u = !n && a || !e.pe || !e.pe(c, d);
    } catch (t) {
      _E(e, 2, t);
    }
    if (
      n && u &&
      (e.tt = !e.o?._, t || e.C.enqueue(n, e.nt ??= Z.it.bind(null, e))),
        !e.o?._
    ) {
      if (u) {
        let a = i ? e.o?.Pe : void 0;
        t || n && (X !== e.Ae || X === null || e.T & 32768) || r
          ? (e.be = d, i && r && (EE(e).Pe = d === void 0 ? Fw : d, e.Re = Y))
          : (e.Re = d,
            l && (e.Ne = !0),
            (X || e.Ae) && Z.Ue !== null && Z.Ue(e, d)),
          e.u !== null && (!i || r || e.o?.Pe !== a) && dT(e, r || i);
      } else if (i) {
        e.Re === Y && sT(e), e.Re = d, l && (e.Ne = !0), e.T & 16384 && Z.he(e);
      } else if (e.Me != f) {
        for (let t = e.u; t !== null; t = t.ae) {
          MT(t.ce, OT(t.ce));
        }
      }
    }
    o !== void 0 && !u && !e.o?._ && dE(e, o), s && !(e.S & 5) && fE(e);
  }
  SE = h,
    (e.Re !== Y || e.o !== null && (e.o.Ye !== null || e.o.qe !== null) ||
      e.S & 5) && (!t || e.S & 1) && (!e.Ae || i) && sT(e),
    e.Ae && n && X !== e.Ae && DT(e.Ae, () => CE(e)),
    p && (kT(e), iT());
}
function wE(e) {
  if (!(e.ie & 68)) {
    if (e.ie & 1) {
      for (let t = e.ut; t; t = t.lt) {
        let n = t.ot, r = n.st || n;
        if (r.oe && wE(r), e.ie & 2) break;
      }
    }
    (e.ie & 130 || e.o?._ && e.Te < Xw && !e.o?.Ie) && CE(e), e.ie &= 280;
  }
}
function TE(e, t) {
  let n = t?.transparent ?? !1,
    r = typeof t == `object` && !!t && `loadingValue` in t,
    i = {
      id: UT(t, n, Q),
      T: (n ? 4 : 0) | !!t?.ownedWrite | (!Q || t?.lazy ? 32 : 0) |
        (t?.sync ? 64 : 0) | (t?.H ? 2 : 0) | 0,
      pe: t?.equals ?? AE,
      Ge: null,
      C: Q?.C ?? bT,
      we: Q?.we ?? Lw,
      Ze: 0,
      oe: e,
      be: r ? t.loadingValue : void 0,
      Me: 0,
      rt: void 0,
      ct: null,
      ut: null,
      je: null,
      Ke: 0,
      u: null,
      _t: null,
      ke: Q,
      Le: null,
      ft: null,
      xe: null,
      ie: t?.lazy ? 512 : 0,
      S: r ? 0 : 4,
      Te: Xw,
      Re: Y,
      Ae: null,
      It: -1,
      Ne: r,
      o: null,
    };
  return t?.unobserved && (EE(i).Et = t.unobserved), kE(i, t), i;
}
function EE(e) {
  return e.o ??= {
    Pe: void 0,
    Nt: void 0,
    Je: void 0,
    ye: void 0,
    Ce: void 0,
    Tt: void 0,
    t: 0,
    Ie: null,
    Ee: null,
    _: void 0,
    fe: void 0,
    le: void 0,
    h: void 0,
    De: !1,
    i: null,
    Et: void 0,
    We: void 0,
    qe: null,
    Ye: null,
    St: void 0,
  };
}
var DE = null;
function OE(e) {
  let t = e.o?.h;
  return t === void 0 ? e.ge ? DE ?? void 0 : void 0 : t;
}
function kE(e, t) {
  e.ct = e;
  let n = Q?.Gt ? Q.Dt : Q;
  if (Q) {
    let t = Q.xe;
    t === null ? Q.xe = e : (e.Le = t, t.ft = e, Q.xe = e);
  }
  n && (e.Me = n.Me + 1), Z.Pt !== null && Z.Pt(e), !t?.lazy && CE(e, !0);
}
function AE(e, t) {
  return e === t;
}
function jE(e, t) {
  if (Z.ht === null && !vE) return e();
  let n = vE;
  vE = !1;
  try {
    return Z.ht === null ? e() : Z.ht(e);
  } finally {
    vE = n;
  }
}
function ME(e, t) {
  e.ie & 512
    ? (e.ie &= -513, CE(e, !0))
    : e.ie & 64
    ? e.T & 32 && CE(e, !0)
    : t && wE(e);
}
function NE(e) {
  if (xE) return Z.gt(e);
  let t = Q;
  t?.Gt && (t = t.Dt);
  let n = e, r = e.st || e;
  if (
    typeof n.oe == `function` && ME(e, !1),
      !n.oe && r === e && e.o?.Pe === void 0 && e.o?.We === void 0 &&
      X === null && SE === null
  ) return t && vE && nE(e, t), !t || e.Re === Y || t.T & 16 ? e.be : e.Re;
  if (t && vE && (nE(e, t, bE), r.oe)) {
    let n = OT(e);
    r.Me >= n.Qe ? (FT(t), PT(n), wE(r)) : t.T & 65536 && wE(r);
    let i = r.Me;
    i >= t.Me && e.ke !== t && (t.Me = i + 1);
  }
  if (r.S & 1) {
    if (t && !(yE && r.Ae && X !== r.Ae)) {
      if (SE === null || Z.Vt(r)) throw !vE && e !== t && nE(e, t), r.o?._;
    } else if (t && r.S & 4) {
      throw !vE && e !== t && nE(e, t), r.o?._;
    } else if (!t && r.S & 4) throw r.o?._;
  }
  if (r.oe && r.S & 2) {
    if (vE && r.Te < Xw) return CE(r), NE(e);
    throw r.o?._;
  }
  if (e.o?.Pe !== void 0 && e.o?.Pe !== Y) {
    if (!(t && t.T & 8192)) return Iw(e.o?.Pe);
    e.T |= Nw;
  }
  if (SE !== null && X !== null && t !== null && Z.vt(e, r, t)) return e.be;
  let i = !t || SE !== null && Z.bt(e, r, t) || e.Re === Y || t.T & 16 ||
      yE && e.Ae && X !== e.Ae || e.T & 131072 && !xE && !(t.T & 8192)
    ? e.be
    : e.Re;
  return !t && r === e && typeof n.oe == `function` && e.T & 32 && !(r.S & 1) &&
    !e.u && (eE.add(e), iT()),
    i;
}
function PE(e, t) {
  if (e.Ae && X !== e.Ae && bT.initTransition(e.Ae), e.T & 128) {
    return Z.xt(e, t);
  }
  let n = e.Re === Y ? e.be : e.Re;
  if (
    typeof t == `function` && (t = t(n)), !(e.S & 4 || !e.pe || !e.pe(n, t))
  ) return t;
  let r = e.Re !== Y;
  return r || sT(e),
    e.Re = t,
    e.T & 256 && Z.Ue !== null && Z.Ue(e, t),
    e.oe !== void 0 && (e.Te = Xw),
    r && e.It === lT && SE === null ? t : (dT(e), iT(), t);
}
function FE(e, t) {
  let n = Q, r = vE;
  Q = e, vE = !1;
  try {
    return t();
  } finally {
    Q = n, vE = r;
  }
}
function IE(e, t = GT()) {
  if (!t) throw new Dw();
  let n = RE(e, t) ? t.we[e.id] : e.defaultValue;
  if (zE(n)) throw new Ow();
  return n;
}
function LE(e, t, n = GT()) {
  if (!n) throw new Dw();
  n.we = { ...n.we, [e.id]: zE(t) ? e.defaultValue : t };
}
function RE(e, t) {
  return !zE(t?.we[e.id]);
}
function zE(e) {
  return e === void 0;
}
function BE(e, t) {
  bT.initTransition(e);
  let n = t();
  return ST(), n;
}
function VE(e) {
  return (...t) =>
    new Promise((n, r) => {
      let i = e(...t);
      bT.initTransition();
      let a = X;
      a.ue.push(i);
      let o = (e, t, o = !1) => {
          a = ET(a);
          let s = a.ue.indexOf(i);
          s >= 0 && a.ue.splice(s, 1),
            bT.initTransition(a),
            iT(),
            o ? r(t) : n(e);
        },
        s = (e, t) => {
          let n;
          try {
            n = t ? i.throw(e) : i.next(e);
          } catch (e) {
            return o(void 0, e, !0);
          }
          if (pE(n)) return void n.then(c, (e) => o(void 0, e, !0));
          c(n);
        },
        c = (e) => {
          if (e.done) return o(e.value);
          let t = !1;
          try {
            if (pE(e.value)) {
              return void e.value.then((e) => {
                t || (t = !0, BE(a, () => s(e)));
              }, (e) => {
                t || (t = !0, BE(a, () => s(e, !0)));
              });
            }
          } catch (e) {
            if (t) return;
            t = !0, BE(a, () => s(e, !0));
            return;
          }
          BE(a, () => s(e.value));
        };
      s();
    });
}
function HE(e) {
  return KT(e);
}
function UE(e) {
  let t = NE.bind(null, e);
  return t[Rw] = e, t;
}
function WE(e, t) {
  return UE(TE(e, t));
}
function GE(e, t) {
  if (typeof e == `function` && !e.length) {
    if (t?.doNotUnwrap) return e;
    do e = e(); while (typeof e == `function` && !e.length);
  }
  if (!t?.skipNonRendered || e != null && e !== !0 && e !== !1 && e !== ``) {
    if (Array.isArray(e)) {
      let n = [];
      return KE(e, n, t)
        ? () => {
          let e = [];
          return KE(n, e, { ...t, doNotUnwrap: !1 }), e;
        }
        : n;
    }
    return e;
  }
}
function KE(e, t = [], n) {
  let r = null, i = !1;
  for (let a = 0; a < e.length; a++) {
    try {
      let r = e[a];
      if (typeof r == `function` && !r.length) {
        if (n?.doNotUnwrap) {
          t.push(r), i = !0;
          continue;
        }
        do r = r(); while (typeof r == `function` && !r.length);
      }
      Array.isArray(r) ? i = KE(r, t, n) || i : n?.skipNonRendered &&
          (r == null || r === !0 || r === !1 || r === ``) || t.push(r);
    } catch (e) {
      if (!(e instanceof Tw)) throw e;
      r = e;
    }
  }
  if (r) throw r;
  return i;
}
function qE(e, t) {
  let n = Symbol(t && t.name || ``);
  function r(e) {
    return YT(() => (LE(r, e.value), YE(() => e.children)));
  }
  return r.id = n, r.defaultValue = e, r;
}
function JE(e) {
  return IE(e);
}
function YE(e) {
  let t = WE(e, { lazy: !0 }), n = WE(() => GE(t()), { lazy: !0, sync: !0 });
  return n.toArray = () => {
    let e = n();
    return Array.isArray(e) ? e : e == null ? [] : [e];
  },
    n;
}
var XE = qE(null),
  ZE = class extends Error {
    constructor() {
      super(`Solid Effect runtime is not provided by RuntimeContext`),
        this.name = `MissingRuntimeContextError`;
    }
  };
function QE(e) {
  let t = JE(XE), n = Cw(e, t ? { memoMap: t.memoMap } : void 0);
  return HE(() => void n.dispose()), n;
}
function $E() {
  let e = JE(XE);
  if (!e) throw new ZE();
  return e;
}
function eD() {
  let e = $E();
  return (t) => e.runFork(t);
}
function tD(e) {
  let t = eD();
  return {
    [Symbol.asyncIterator]() {
      let n = t(e), r = !1, i = !1, a = { done: !0, value: void 0 };
      return {
        async next() {
          if (r || i) return a;
          let e = await dw(yw(n));
          if (i) return a;
          if (PC(e)) return r = !0, { done: !1, value: e.value };
          if (i = !0, FC(e)) {
            let t = e.cause;
            if (IC(e)) return a;
            throw MC(t);
          }
          return a;
        },
        async return() {
          return r || i ? a : (i = !0, await dw(bw(n)), a);
        },
      };
    },
  };
}
var nD = class extends Error {
  constructor() {
    super(`Action interrupted`), this.name = `ActionInterruptedError`;
  }
};
function rD(e) {
  let t = eD(),
    n = null,
    r = VE(function* (...r) {
      let i = e(...r), a = i.next();
      for (; !a.done;) {
        let e = t(a.value);
        n = e;
        let r = yield dw(yw(e));
        if (n === e && (n = null), PC(r)) a = i.next(r.value);
        else if (FC(r)) {
          let e = r.cause;
          a = IC(r) ? i.throw(new nD()) : i.throw(MC(e));
        }
      }
      return a.value;
    }),
    i = (...e) => (i.interrupt(), r(...e));
  return i.interrupt = () => {
    let e = n;
    n = null, e && dw(bw(e));
  },
    i;
}
var iD = XE,
  aD = nD,
  oD = QE,
  sD = tD,
  cD = rD,
  lD = N(`<ul>`),
  uD = N(`<div class=results>`),
  dD = N(`<p class=empty>`),
  fD = N(
    `<li><div><span class=pkg-name></span><span class=pkg-desc></span></div><span class=pkg-downloads>/wk`,
  ),
  pD = N(
    `<section class=panel><header><h2>Typeahead search</h2><p>Each keystroke starts an Effect fiber (retry ×3 w/ exponential backoff, 4s timeout, ~35% transient failure rate). Superseded flights are <em>interrupted</em>, not ignored — Solid closes the stale iterator, <code>runEffect</code> interrupts the fiber.</p></header><input id=custom-package-search name=package-search type=search aria-label="Search packages"placeholder="Search packages… (try typing “solid” quickly)"autofocus>`,
  ),
  mD = N(
    `<div class=error-box><p>Search gave up after retries: </p><button>Try again`,
  ),
  hD = N(`<p class=loading>Searching…`);
function gD(e) {
  return e >= 1e6
    ? (e / 1e6).toFixed(1) + `M`
    : e >= 1e3
    ? Math.round(e / 1e3) + `k`
    : String(e);
}
function _D(e) {
  let t = () => pr(e.results);
  var n = uD();
  return P(
    n,
    M(mo, {
      get when() {
        return t().length > 0;
      },
      get fallback() {
        var t = dD();
        return P(
          t,
          (() => {
            var t = wo(() => !!mr(e.results));
            return () => t() ? `Searching…` : `No packages match “${e.query}”.`;
          })(),
        ),
          t;
      },
      get children() {
        var e = lD();
        return P(
          e,
          M(po, {
            get each() {
              return t();
            },
            children: (e) =>
              (() => {
                var t = fD(),
                  n = t.firstChild,
                  r = n.firstChild,
                  i = r.nextSibling,
                  a = n.nextSibling,
                  o = a.firstChild;
                return P(r, () => e.name),
                  P(i, () => e.description),
                  P(a, () => gD(e.downloads), o),
                  t;
              })(),
          }),
        ),
          e;
      },
    }),
  ),
    Co(() => !!mr(e.results), (e) => {
      n.classList.toggle(`stale`, e);
    }),
    n;
}
function vD() {
  let [e, t] = ro(``),
    n = no(() => {
      let t = e().trim();
      return t ? sD(Xv(t)) : [];
    });
  var r = pD(), i = r.firstChild.nextSibling;
  return i.$$input = (e) => t(e.currentTarget.value),
    P(
      r,
      M(mo, {
        get when() {
          return e().trim();
        },
        children: (e) =>
          M(_o, {
            fallback: (e, t) =>
              (() => {
                var n = mD(), r = n.firstChild;
                r.firstChild;
                var i = r.nextSibling;
                return P(r, () => String(e()), null), Wo(i, `click`, t, !0), n;
              })(),
            get children() {
              return M(vo, {
                get fallback() {
                  return hD();
                },
                get children() {
                  return M(_D, {
                    results: n,
                    get query() {
                      return e();
                    },
                  });
                },
              });
            },
          }),
      }),
      null,
    ),
    Co(() => e(), (e) => {
      i.value = e ?? ``;
    }),
    r;
}
No([`input`, `click`]);
var yD = N(`<button class=danger>Cancel checkout`),
  bD = N(`<ul class=orders>`),
  xD = N(
    `<section class=panel><header><h2>Checkout saga</h2><p>Three Effect steps inside one Solid action transaction. Cancel mid-charge (it takes ~2.6s) or toggle the decline: the fiber is interrupted, compensations run server-side, and the optimistic UI reverts — automatically on both sides.</p></header><div class=cart><div class="cart-row total"><span class=cart-name>Total</span><span class=cart-price>$</span></div></div><div class=checkout-controls><label class=decline-toggle><input id=custom-decline-card name=decline-card type=checkbox>Simulate card decline (typed <code>CardDeclinedError</code>)</label></div><ol class=steps></ol><h3>Your orders</h3><!>`,
  ),
  SD = N(
    `<div class=cart-row><span class=cart-name></span><span class=qty><button>−</button><button>+</button></span><span class=cart-price>$`,
  ),
  CD = N(`<button class=primary>Place order — $`),
  wD = N(`<li>`),
  TD = N(`<p>`),
  ED = N(`<p class=loading>Loading orders…`),
  DD = N(`<p class=empty>No orders yet.`),
  OD = N(
    `<li><span class=pkg-name></span><span class=pkg-desc> line<!> · placed <!></span><span class=cart-price>$`,
  ),
  kD = [{ phase: `reserving`, label: `Reserve inventory` }, {
    phase: `charging`,
    label: `Charge card`,
  }, { phase: `finalizing`, label: `Create order` }],
  AD = [{
    id: `sku_signal`,
    name: `Signal (fine-grained)`,
    price: 19.99,
    quantity: 1,
  }, {
    id: `sku_fiber`,
    name: `Fiber (interruptible)`,
    price: 24.5,
    quantity: 2,
  }, {
    id: `sku_boundary`,
    name: `Boundary (loading)`,
    price: 9.75,
    quantity: 1,
  }];
function jD() {
  let [e, t] = oo(AD.map((e) => ({ ...e }))),
    [n] = so(async () => ey(), []),
    [r, i] = ao(`idle`),
    [a, o] = ro(null),
    [s, c] = ro(!1),
    l = () => e.reduce((e, t) => e + t.price * t.quantity, 0),
    u = cD(function* (e, t) {
      let r, a;
      o(null);
      try {
        i(`reserving`),
          r = yield* ty(e),
          i(`charging`),
          a = yield* iy(e.reduce((e, t) => e + t.price * t.quantity, 0), t),
          i(`finalizing`);
        let s = yield* ay(e, r, a);
        return o({
          kind: `success`,
          text: `Order ${s.id} confirmed — $${s.total.toFixed(2)}`,
        }),
          Tr(n),
          s;
      } catch (e) {
        throw a && (yield* ry(a)),
          r && (yield* ny(r)),
          e instanceof Zv
            ? o({
              kind: `error`,
              text: `Card declined for $${
                e.amount.toFixed(2)
              } — refunds/releases applied, cart untouched`,
            })
            : e instanceof aD &&
              o({
                kind: `info`,
                text: `Checkout cancelled — compensations ran, cart untouched`,
              }),
          e;
      }
    }),
    d,
    f = () => {
      requestAnimationFrame(() => d?.focus());
    },
    p = () => {
      u(e.map((e) => ({ ...e })), s()).catch(() => {}).finally(f);
    },
    m = () => r() !== `idle`,
    h = (e) => {
      let t = [`reserving`, `charging`, `finalizing`],
        n = t.indexOf(r()),
        i = t.indexOf(e);
      return n === -1 ? `` : i < n ? `done` : i === n ? `active` : ``;
    };
  var g = xD(),
    _ = g.firstChild.nextSibling,
    v = _.firstChild,
    ee = v.firstChild.nextSibling;
  ee.firstChild;
  var te = _.nextSibling,
    ne = te.firstChild.firstChild,
    re = te.nextSibling,
    ie = re.nextSibling,
    ae = ie.nextSibling;
  return P(
    _,
    M(po, {
      each: e,
      children: (e, n) =>
        (() => {
          var r = SD(),
            i = r.firstChild,
            a = i.nextSibling,
            o = a.firstChild,
            s = o.nextSibling,
            c = a.nextSibling;
          return c.firstChild,
            P(i, () => e.name),
            o.$$click = () =>
              t((e) => {
                e[n()].quantity--;
              }),
            P(a, () => e.quantity, s),
            s.$$click = () =>
              t((e) => {
                e[n()].quantity++;
              }),
            P(c, () => (e.price * e.quantity).toFixed(2), null),
            Co(
              () => ({
                e: `Decrease ${e.name} quantity`,
                t: m() || e.quantity <= 1,
                a: `Increase ${e.name} quantity`,
                o: m(),
              }),
              ({ e, t, a: n, o: r }, i) => {
                e !== i?.e && Ho(o, `aria-label`, e),
                  t !== i?.t && Ho(o, `disabled`, t),
                  n !== i?.a && Ho(s, `aria-label`, n),
                  r !== i?.o && Ho(s, `disabled`, r);
              },
            ),
            r;
        })(),
    }),
    v,
  ),
    P(ee, () => l().toFixed(2), null),
    ne.$$input = (e) => c(e.currentTarget.checked),
    P(
      te,
      M(mo, {
        get when() {
          return m();
        },
        get fallback() {
          var e = CD();
          e.firstChild, e.$$click = p;
          var t = d;
          return typeof t == `function` || Array.isArray(t)
            ? Ko(() => t, e)
            : d = e,
            P(e, () => l().toFixed(2), null),
            e;
        },
        get children() {
          var e = yD();
          return e.$$click = () => u.interrupt(), e;
        },
      }),
      null,
    ),
    P(
      re,
      M(po, {
        each: kD,
        children: (e) =>
          (() => {
            var t = wD();
            return P(t, () => e.label),
              Co(
                () => ({
                  e: h(e.phase) === `active` ? `step` : void 0,
                  t: h(e.phase) === `done`,
                  a: h(e.phase) === `active`,
                }),
                ({ e, t: n, a: r }, i) => {
                  e !== i?.e && Ho(t, `aria-current`, e),
                    n !== i?.t && t.classList.toggle(`done`, n),
                    r !== i?.a && t.classList.toggle(`active`, r);
                },
              ),
              t;
          })(),
      }),
    ),
    P(
      g,
      M(mo, {
        get when() {
          return a();
        },
        children: (e) =>
          (() => {
            var t = TD();
            return P(t, () => e().text),
              Co(
                () => ({
                  e: e().kind === `error` ? `assertive` : `polite`,
                  t: `notice ${e().kind}`,
                  a: e().kind === `error` ? `alert` : `status`,
                }),
                ({ e, t: n, a: r }, i) => {
                  e !== i?.e && Ho(t, `aria-live`, e),
                    Uo(t, n, i?.t),
                    r !== i?.a && Ho(t, `role`, r);
                },
              ),
              t;
          })(),
      }),
      ie,
    ),
    P(
      g,
      M(vo, {
        get fallback() {
          return ED();
        },
        get children() {
          return M(mo, {
            get when() {
              return n.length > 0;
            },
            get fallback() {
              return DD();
            },
            get children() {
              var e = bD();
              return P(
                e,
                M(po, {
                  each: n,
                  children: (e) =>
                    (() => {
                      var t = OD(),
                        n = t.firstChild,
                        r = n.nextSibling,
                        i = r.firstChild,
                        a = i.nextSibling,
                        o = a.nextSibling.nextSibling,
                        s = r.nextSibling;
                      return s.firstChild,
                        P(n, () => e.id),
                        P(r, () => e.items.length, i),
                        P(r, () => e.items.length === 1 ? `` : `s`, a),
                        P(r, () => e.placedAt, o),
                        P(s, () => e.total.toFixed(2), null),
                        t;
                    })(),
                }),
              ),
                e;
            },
          });
        },
      }),
      ae,
    ),
    Co(() => s(), (e) => {
      ne.checked = e;
    }),
    g;
}
No([`input`, `click`]);
var MD = {
    "~effect/reactivity/AsyncResult": { E: I, A: I },
    pipe() {
      return cs(this, arguments);
    },
    [Ls](e) {
      if (this._tag !== e._tag || this.waiting !== e.waiting) return !1;
      switch (this._tag) {
        case `Initial`:
          return !0;
        case `Success`:
          return Rs(this.value, e.value);
        case `Failure`:
          return Rs(this.cause, e.cause);
      }
    },
    [xs]() {
      let e = R(`${this._tag}:${this.waiting}`);
      return this._tag === `Initial`
        ? e
        : Cs(e)(this._tag === `Success` ? L(this.value) : L(this.cause));
    },
  },
  ND = (e, t) =>
    e._tag === `Success` ? zD(e.value) : HD(e.cause, { previous: t }),
  PD = (e) => e._tag === `None` ? LD(!0) : WD(e.value),
  FD = (e) => e._tag === `Initial`,
  ID = (e) => e._tag !== `Initial`,
  LD = (e = !1) => {
    let t = Object.create(MD);
    return t._tag = `Initial`, t.waiting = e, t;
  },
  RD = (e) => e._tag === `Success`,
  zD = (e, t) => {
    let n = Object.create(MD);
    return n._tag = `Success`,
      n.value = e,
      n.waiting = t?.waiting ?? !1,
      n.timestamp = t?.timestamp ?? Date.now(),
      n;
  },
  BD = (e) => e._tag === `Failure`,
  VD = (e, t) => {
    let n = Object.create(MD);
    return n._tag = `Failure`,
      n.cause = e,
      n.previousSuccess = t?.previousSuccess ?? Nl(),
      n.waiting = t?.waiting ?? !1,
      n;
  },
  HD = (e, t) =>
    VD(e, {
      previousSuccess: Vl(t.previous, (e) =>
        RD(e) ? Pl(e) : BD(e) ? e.previousSuccess : Nl()),
      waiting: t.waiting,
    }),
  UD = (e, t) => HD(mm(e), t),
  WD = (e, t) => {
    if (e.waiting) return t?.touch ? GD(e) : e;
    let n = Object.assign(Object.create(MD), e);
    return n.waiting = !0, t?.touch && RD(n) && (n.timestamp = Date.now()), n;
  },
  GD = (e) => RD(e) ? zD(e.value, { waiting: e.waiting }) : e,
  KD = (e, t) =>
    e._tag === `Failure` ? HD(e.cause, { previous: t, waiting: e.waiting }) : e,
  qD = (e) =>
    e._tag === `Success`
      ? Pl(e.value)
      : e._tag === `Failure`
      ? Bl(e.previousSuccess, (e) => e.value)
      : Nl(),
  JD = F(2, (e, t) => Rl(qD(e), t)),
  YD = (e) => zl(qD(e), () => new _m(`AsyncResult.getOrThrow: no value found`)),
  XD = (e) => {
    switch (e._tag) {
      case `Success`:
        return xm(e.value);
      case `Failure`:
        return Sm(e.cause);
      default:
        return Cm(new _m());
    }
  },
  ZD = `~effect/reactivity/AtomRegistry`,
  QD = (e) =>
    new iO(
      e?.initialValues,
      e?.scheduleTask,
      e?.timeoutResolution,
      e?.defaultIdleTTL,
    ),
  $D = iu(ZD),
  eO = { immediate: !0 },
  tO = (e) => {
    e();
  },
  nO = `~effect-atom/atom/Atom/Serializable`,
  rO = (e) => nO in e ? e[nO].key : e,
  iO = class {
    [ZD];
    timeoutResolution;
    defaultIdleTTL;
    scheduler;
    schedulerAsync;
    dispatcher;
    onNodeAdded;
    onNodeRemoved;
    constructor(e, t, n, r) {
      if (
        this[ZD] = ZD,
          this.scheduler = new xd(`sync`, t),
          this.schedulerAsync = new xd(`async`, t),
          this.dispatcher = this.schedulerAsync.makeDispatcher(),
          this.defaultIdleTTL = r,
          this.timeoutResolution = n === void 0 && r !== void 0
            ? Math.round(r / 2)
            : n ?? 1e3,
          e !== void 0
      ) {
        for (let [t, n] of e) {
          let e = t;
          for (; e.initialValueTarget;) e = e.initialValueTarget;
          this.ensureNode(e).setInitialValue(n);
        }
      }
    }
    nodes = new Map();
    preloadedSerializable = new Map();
    timeoutBuckets = new Map();
    nodeTimeoutBucket = new Map();
    disposed = !1;
    getNodes() {
      return this.nodes;
    }
    get(e) {
      return this.ensureNode(e).value();
    }
    set(e, t) {
      e.write(this.ensureNode(e).writeContext, t);
    }
    setSerializable(e, t) {
      this.preloadedSerializable.set(e, t);
    }
    modify(e, t) {
      let n = this.ensureNode(e), r = t(n.value());
      return e.write(n.writeContext, r[1]), r[0];
    }
    update(e, t) {
      let n = this.ensureNode(e);
      e.write(n.writeContext, t(n.value()));
    }
    refresh = (e) => {
      e.refresh === void 0 ? this.invalidateAtom(e) : e.refresh(this.refresh);
    };
    subscribe(e, t, n) {
      let r = this.ensureNode(e);
      n?.immediate && t(r.value());
      let i = r.subscribe(function () {
        t(r._value);
      });
      return () => {
        i(), r.canBeRemoved && this.scheduleNodeRemoval(r);
      };
    }
    mount(e) {
      return this.subscribe(e, fs, eO);
    }
    atomHasTtl(e) {
      return !e.keepAlive && e.idleTTL !== 0 &&
        (e.idleTTL !== void 0 || this.defaultIdleTTL !== void 0);
    }
    ensureNode(e) {
      let t = rO(e), n = this.nodes.get(t);
      if (
        n === void 0
          ? (n = this.createNode(e),
            this.nodes.set(t, n),
            this.onNodeAdded?.(n))
          : this.atomHasTtl(e) && this.removeNodeTimeout(n),
          typeof t == `string` && this.preloadedSerializable.has(t)
      ) {
        let r = this.preloadedSerializable.get(t);
        this.preloadedSerializable.delete(t);
        let i = e[nO].decode(r), a = e;
        for (; a.initialValueTarget;) a = a.initialValueTarget;
        a === e ? n.setValue(i) : this.ensureNode(a).setInitialValue(i);
      }
      return n;
    }
    createNode(e) {
      if (this.disposed) {
        throw Error(`Cannot access Atom ${e}: registry is disposed`);
      }
      return e.keepAlive || this.scheduleAtomRemoval(e), new sO(this, e);
    }
    invalidateAtom = (e) => {
      this.ensureNode(e).invalidate();
    };
    scheduleAtomRemoval(e) {
      this.dispatcher.scheduleTask(() => {
        let t = this.nodes.get(rO(e));
        t !== void 0 && t.canBeRemoved && this.removeNode(t);
      }, 0);
    }
    scheduleNodeRemoval(e) {
      this.dispatcher.scheduleTask(() => {
        e.canBeRemoved && this.removeNode(e);
      }, 0);
    }
    removeNode(e) {
      this.atomHasTtl(e.atom)
        ? this.setNodeTimeout(e)
        : (this.nodes.delete(rO(e.atom)), e.remove(), this.onNodeRemoved?.(e));
    }
    setNodeTimeout(e) {
      if (this.nodeTimeoutBucket.has(e)) return;
      let t = e.atom.idleTTL ?? this.defaultIdleTTL;
      if (this.#e !== null && (t -= this.#e, t <= 0)) {
        this.nodes.delete(rO(e.atom)), e.remove(), this.onNodeRemoved?.(e);
        return;
      }
      let n = Math.ceil(t / this.timeoutResolution) * this.timeoutResolution,
        r = Date.now() + n,
        i = r - r % this.timeoutResolution + this.timeoutResolution,
        a = this.timeoutBuckets.get(i);
      a === void 0 &&
      (a = [new Set(), setTimeout(() => this.sweepBucket(i), i - Date.now())],
        this.timeoutBuckets.set(i, a)),
        a[0].add(e),
        this.nodeTimeoutBucket.set(e, i);
    }
    removeNodeTimeout(e) {
      let t = this.nodeTimeoutBucket.get(e);
      if (t === void 0) return;
      this.nodeTimeoutBucket.delete(e), this.scheduleNodeRemoval(e);
      let [n, r] = this.timeoutBuckets.get(t);
      n.delete(e),
        n.size === 0 && (clearTimeout(r), this.timeoutBuckets.delete(t));
    }
    #e = null;
    sweepBucket(e) {
      let t = this.timeoutBuckets.get(e)[0];
      this.timeoutBuckets.delete(e),
        t.forEach((e) => {
          this.nodeTimeoutBucket.delete(e),
            e.canBeRemoved &&
            (this.nodes.delete(rO(e.atom)),
              this.onNodeRemoved?.(e),
              this.#e = e.atom.idleTTL ?? this.defaultIdleTTL,
              e.remove(),
              this.#e = null);
        });
    }
    reset() {
      this.timeoutBuckets.forEach(([, e]) => clearTimeout(e)),
        this.timeoutBuckets.clear(),
        this.nodeTimeoutBucket.clear(),
        this.nodes.forEach((e) => {
          e.remove(), this.onNodeRemoved?.(e);
        }),
        this.nodes.clear();
    }
    dispose() {
      this.disposed = !0, this.reset();
    }
  },
  aO = { alive: 1, initialized: 2, waitingForValue: 4 },
  oO = {
    uninitialized: aO.alive | aO.waitingForValue,
    stale: aO.alive | aO.initialized | aO.waitingForValue,
    valid: aO.alive | aO.initialized,
    removed: 0,
  },
  sO = class {
    constructor(e, t) {
      this.registry = e, this.atom = t, this.writeContext = new dO(e, this);
    }
    registry;
    atom;
    state = oO.uninitialized;
    lifetime;
    writeContext;
    preserveInitialValueOnBuild = !1;
    parents = new Set();
    previousParents;
    children = new Set();
    listeners = new Set();
    skipInvalidation = !1;
    building = !1;
    invalidatedDuringBuild = !1;
    currentState() {
      switch (this.state) {
        case oO.uninitialized:
          return `uninitialized`;
        case oO.stale:
          return `stale`;
        case oO.valid:
          return `valid`;
        default:
          return `removed`;
      }
    }
    get canBeRemoved() {
      return !this.atom.keepAlive && this.listeners.size === 0 &&
        this.children.size === 0 && this.state !== 0;
    }
    _value = void 0;
    value() {
      if ((this.state & aO.waitingForValue) !== 0) {
        this.lifetime = uO(this), this.building = !0;
        let e = this.atom.read(this.lifetime);
        if (
          this.building = !1,
            (this.state & aO.waitingForValue) !== 0 &&
            (this.preserveInitialValueOnBuild
              ? (this.preserveInitialValueOnBuild = !1, this.state = oO.valid)
              : this.setValue(e)),
            this.previousParents
        ) {
          let e = this.previousParents;
          this.previousParents = void 0;
          for (let t of e) {
            t.removeChild(this),
              t.canBeRemoved && this.registry.scheduleNodeRemoval(t);
          }
        }
      }
      return this._value;
    }
    valueOption() {
      return (this.state & aO.initialized) === 0 ? Nl() : Pl(this._value);
    }
    setInitialValue(e) {
      if ((this.state & aO.initialized) === 0) {
        this.preserveInitialValueOnBuild = !0,
          this.state = oO.stale,
          this._value = e,
          $.phase === fO.collect ? $.notify.add(this) : this.notify();
        return;
      }
      this.setValue(e);
    }
    setValue(e) {
      if ((this.state & aO.initialized) === 0) {
        this.state = oO.valid,
          this._value = e,
          $.phase === fO.collect ? $.notify.add(this) : this.notify();
        return;
      }
      this.state = oO.valid,
        !this.atom.equals(this._value, e) &&
        (this._value = e,
          this.skipInvalidation
            ? this.skipInvalidation = !1
            : this.invalidateChildren(),
          this.listeners.size > 0 &&
          ($.phase === fO.collect ? $.notify.add(this) : this.notify()));
    }
    addParent(e) {
      this.parents.add(e),
        this.previousParents !== void 0 &&
        (this.previousParents.delete(e),
          this.previousParents.size === 0 && (this.previousParents = void 0)),
        e.children.has(this) ||
        (e.children.add(this), e.skipInvalidation &&= !1);
    }
    removeChild(e) {
      this.children.delete(e);
    }
    invalidate() {
      this.building && $.phase === fO.collect &&
      (this.invalidatedDuringBuild = !0),
        this.state === oO.valid &&
        (this.state = oO.stale, this.disposeLifetime()),
        $.phase === fO.collect
          ? $.stale.push(this)
          : this.atom.lazy && this.listeners.size === 0 && !cO(this.children)
          ? (this.invalidateChildren(), this.skipInvalidation = !0)
          : this.value();
    }
    invalidateChildren() {
      if (this.children.size === 0) return;
      let e = this.children;
      this.children = new Set();
      for (let t of e) t.invalidate();
    }
    notify() {
      this.listeners.forEach(tO),
        $.phase === fO.commit && $.notify.delete(this);
    }
    disposeLifetime() {
      this.lifetime !== void 0 &&
      (this.lifetime.dispose(), this.lifetime = void 0),
        this.parents.size !== 0 &&
        (this.previousParents = this.parents, this.parents = new Set());
    }
    remove() {
      if (
        this.state = oO.removed,
          this.listeners.clear(),
          this.lifetime === void 0 ||
          (this.disposeLifetime(), this.previousParents === void 0)
      ) return;
      let e = this.previousParents;
      this.previousParents = void 0;
      for (let t of e) {
        t.removeChild(this), t.canBeRemoved && this.registry.removeNode(t);
      }
    }
    subscribe(e) {
      return this.listeners.add(e), () => this.listeners.delete(e);
    }
  };
function cO(e) {
  if (e.size === 0) return !1;
  let t = e, n, r = 0;
  for (; t !== void 0;) {
    for (let e of t) {
      if (!e.atom.lazy || e.listeners.size > 0) return !0;
      else {e.children.size > 0 &&
          (n === void 0 ? n = [e.children] : n.push(e.children));}
    }
    t = n?.[r++];
  }
  return !1;
}
var lO = {
    get registry() {
      return this.node.registry;
    },
    addFinalizer(e) {
      if (this.disposed) return e();
      this.finalizers ??= [], this.finalizers.push(e);
    },
    get(e) {
      if (this.disposed) return this.node.registry.get(e);
      let t = this.node.registry.ensureNode(e), n = t.value();
      return this.node.addParent(t), n;
    },
    result(e, t) {
      if (this.disposed || this.isFn) return this.resultOnce(e, t);
      let n = this.get(e);
      if (t?.suspendOnWaiting && n.waiting) return Uh;
      switch (n._tag) {
        case `Initial`:
          return Uh;
        case `Failure`:
          return Sm(n.cause);
        case `Success`:
          return G(n.value);
      }
    },
    resultOnce(e, t) {
      return Hh((n) => {
        let r = this.once(e);
        if (r._tag !== `Initial` && !(t?.suspendOnWaiting && r.waiting)) {
          return n(XD(r));
        }
        let i = this.node.registry.subscribe(e, (e) => {
          e._tag === `Initial` || t?.suspendOnWaiting && e.waiting ||
            (i(), n(XD(e)));
        }, { immediate: !1 });
        return K(i);
      });
    },
    setResult(e, t) {
      return this.disposed
        ? Uh
        : (this.node.registry.set(e, t),
          this.resultOnce(e, { suspendOnWaiting: !0 }));
    },
    some(e) {
      if (this.disposed || this.isFn) return this.someOnce(e);
      let t = this.get(e);
      return t._tag === `None` ? Uh : G(t.value);
    },
    someOnce(e) {
      return Hh((t) => {
        let n = this.once(e);
        if (Il(n)) return t(G(n.value));
        let r = this.node.registry.subscribe(e, (e) => {
          Fl(e) || (r(), t(G(e.value)));
        }, { immediate: !1 });
        return K(r);
      });
    },
    once(e) {
      return this.node.registry.get(e);
    },
    self() {
      return this.disposed ? Nl() : this.node.valueOption();
    },
    refresh(e) {
      this.disposed || this.node.registry.refresh(e);
    },
    refreshSelf() {
      this.disposed || this.node.invalidate();
    },
    mount(e) {
      this.disposed || this.addFinalizer(this.node.registry.mount(e));
    },
    subscribe(e, t, n) {
      this.disposed || this.addFinalizer(this.node.registry.subscribe(e, t, n));
    },
    setSelf(e) {
      this.disposed || this.node.setValue(e);
    },
    set(e, t) {
      this.disposed || this.node.registry.set(e, t);
    },
    stream(e, t) {
      return this.disposed ? _v : gv((n) =>
        K(() => {
          this.subscribe(e, (e) => d_(n, e), {
            immediate: !t?.withoutInitialValue,
          });
        })
      );
    },
    streamResult(e, t) {
      return this.stream(e, t).pipe(
        Sv(ID),
        xv((e) => e._tag === `Success` ? G(e.value) : Kh(e.cause)),
      );
    },
    dispose() {
      if (this.disposed = !0, this.finalizers === void 0) return;
      let e = this.finalizers;
      this.finalizers = void 0;
      for (let t = e.length - 1; t >= 0; t--) e[t]();
    },
  },
  uO = (e) => {
    function t(n) {
      if (t.disposed || t.isFn) return e.registry.get(n);
      let r = e.registry.ensureNode(n), i = r.value();
      return e.addParent(r), i;
    }
    return Object.setPrototypeOf(t, lO),
      t.isFn = !1,
      t.disposed = !1,
      t.finalizers = void 0,
      t.node = e,
      t;
  },
  dO = class {
    constructor(e, t) {
      this.registry = e, this.node = t;
    }
    registry;
    node;
    get(e) {
      return this.registry.get(e);
    }
    set(e, t) {
      return this.registry.set(e, t);
    }
    setSelf(e) {
      return this.node.setValue(e);
    }
    refreshSelf() {
      return this.node.invalidate();
    }
  },
  fO = { disabled: 0, collect: 1, commit: 2 },
  $ = { phase: fO.disabled, depth: 0, stale: [], notify: new Set() };
function pO(e) {
  $.phase = fO.collect, $.depth++;
  try {
    if (e(), $.depth === 1) {
      for (let e = 0; e < $.stale.length; e++) mO($.stale[e]);
      $.phase = fO.commit;
      for (let e of $.notify) e.notify();
      $.notify.clear();
    }
  } finally {
    $.depth--, $.depth === 0 && ($.phase = fO.disabled, $.stale = []);
  }
}
function mO(e) {
  if (e.state === oO.valid) {
    if (!e.invalidatedDuringBuild) return;
    e.invalidatedDuringBuild = !1, e.state = oO.stale, e.disposeLifetime();
  }
  for (let t of e.parents) t.state !== oO.valid && mO(t);
  e.state !== oO.valid && e.value();
}
var hO = `~effect/reactivity/Atom`,
  gO = (e) => bs(e, hO),
  _O = `~effect/reactivity/Atom/Writable`,
  vO = F(2, (e, t) => {
    let n = Ku(t), r = ed(n);
    return Object.assign(Object.create(Object.getPrototypeOf(e)), {
      ...e,
      keepAlive: !r,
      idleTTL: r ? dd(n) : void 0,
    });
  })(0),
  yO = {
    [hO]: hO,
    equals: Object.is,
    ...Dc,
    toJSON() {
      return {
        _id: `Atom`,
        keepAlive: this.keepAlive,
        lazy: this.lazy,
        label: this.label,
      };
    },
  },
  bO = {
    ...yO,
    atom(e, t) {
      let n = OO(e, t);
      return wO((e) => {
        let t = e.self(), r = e(this);
        return r._tag === `Success` ? n(e, r.value) : KD(r, t);
      });
    },
    fn(e, t) {
      return arguments.length === 0 ? (e, t) => xO(this, e, t) : xO(this, e, t);
    },
    pull(e, t) {
      let n = vO(jO(0));
      return KO(
        n,
        wO((r) => {
          let i = r.self(), a = r(this);
          return a._tag === `Success`
            ? NO(r, GO(r, n, e, t), LD(!0), a.value)
            : KD(a, i);
        }),
      );
    },
    subscriptionRef(e) {
      return zO(
        vO(wO((t) => {
          let n = t.self(), r = t(this);
          if (r._tag !== `Success`) return KD(r, n);
          let i = typeof e == `function` ? e(t) : e;
          return Fv(i) ? i : NO(t, i, LD(!0), r.value);
        })),
        (e, t) => RO(e, t, YD(e(this))),
      );
    },
  },
  xO = (e, t, n) => {
    let [r, i, a] = WO(
      n?.reactivityKeys
        ? (e, r) => {
          let i = t(e, r);
          return Ih(i) ? kv(i, n.reactivityKeys) : Cv(i, Av(n.reactivityKeys));
        }
        : t,
      n,
    );
    return TO((t) => {
      t.get(a);
      let n = t.self(), i = t.get(e);
      return i._tag === `Success` ? r(t, i.value) : KD(i, n);
    }, i);
  },
  SO = { ...yO, [_O]: _O },
  CO = (e) => _O in e,
  wO = (e, t) => {
    let n = Object.create(yO);
    return n.keepAlive = !1, n.lazy = !0, n.read = e, n.refresh = t, n;
  },
  TO = (e, t, n) => {
    let r = Object.create(SO);
    return r.keepAlive = !1,
      r.lazy = !0,
      r.read = e,
      r.write = t,
      r.refresh = n,
      r;
  };
function EO(e, t) {
  e.setSelf(t);
}
var DO = (e, t) => {
    let n = OO(e, t);
    return `~effect/reactivity/Atom` in n ? n : wO(n);
  },
  OO = (e, t) => {
    if (typeof e == `function` && !Ih(e) && !pv(e)) {
      let n = e;
      return function (e, r) {
        let i = n(e);
        switch (typeof i) {
          case `function`:
          case `object`:
            return i === null
              ? i
              : kO in i
              ? MO(e, i, t, r)
              : AO in i
              ? IO(e, i, t, r)
              : i;
          default:
            return i;
        }
      };
    }
    return Ih(e)
      ? function (n, r) {
        return MO(n, e, t, r);
      }
      : pv(e)
      ? function (n, r) {
        return IO(n, e, t, r);
      }
      : jO(e);
  },
  kO = `~effect/Effect`,
  AO = `~effect/Stream`,
  jO = (e) =>
    TO(function (t) {
      return e;
    }, EO),
  MO = (e, t, n, r) =>
    NO(
      e,
      t,
      n?.initialValue === void 0 ? LD() : zD(n.initialValue),
      r,
      n?.uninterruptible,
    );
function NO(e, t, n, r = Su(), i = !1) {
  let a = e.self(), o = Nm();
  e.addFinalizer(() => {
    wg(r)(Rm(o, wm));
  });
  let s,
    c = !1,
    l = PO(
      r.pipe(Tu(Mm, o), Tu($D, e.registry), Tu(_d, e.registry.scheduler)),
      t,
      function (t) {
        s = ND(t, a), c && e.setSelf(s);
      },
      i,
    );
  return c = !0,
    l !== void 0 && e.addFinalizer(l),
    s === void 0 ? a._tag === `Some` ? PD(a) : WD(n) : s;
}
function PO(e, t, n, r = !1) {
  if (bm(t)) {
    n(t);
    return;
  }
  let i = wg(e)(t);
  i.currentDispatcher?.flush();
  let a = i.pollUnsafe();
  if (a) {
    n(a);
    return;
  }
  let o = i.addObserver(n);
  function s() {
    o(), r || i.interruptUnsafe();
  }
  return s;
}
function FO(e) {
  let t = e?.memoMap ?? vO(DO(() => Jm())), n = (e) => gO(t) ? e(t) : t, r = jv;
  function i(e) {
    let t = Object.create(bO);
    t.keepAlive = !1, t.lazy = !0, t.refresh = void 0, t.factory = i;
    let a = qO(
      wO(typeof e == `function` ? (t) => ch(e(t), r) : () => ch(e, r)),
    );
    return t.layer = a,
      t.read = function (e) {
        let t = e(a);
        return MO(e, Jh(mg, (r) => Zm(t, n(e), r)), { uninterruptible: !0 });
      },
      t;
  }
  i.memoMap = t,
    i.addGlobalLayer = (e) => {
      r = ch(r, sh(e, jv));
    };
  let a = vO(DO((e) => ug((t) => Zm(jv, n(e), ku(t, Mm))).pipe(Qh(ku(Ev)))));
  return i.withReactivity = (e) => (t) =>
    JO(t, (n) => {
      let r = YD(n(a));
      return n.addFinalizer(r.registerUnsafe(e, () => {
        n.refresh(t);
      })),
        n.subscribe(t, (e) => n.setSelf(e)),
        n.once(t);
    }, { initialValueTarget: t }),
    i;
}
FO().withReactivity;
var IO = (e, t, n, r) =>
  LO(e, t, n?.initialValue === void 0 ? LD() : zD(n.initialValue), r);
function LO(e, t, n, r = Su()) {
  let i = e.self();
  r = Tu(r, $D, e.registry);
  let a = hg((n) =>
      Jh(sv(t.channel, n), (t) =>
        Rh({
          while: us,
          body: () => t,
          step(t) {
            e.setSelf(zD(Xl(t), { waiting: !0 }));
          },
        }))
    ).pipe(
      tg((t) => (uh(t)
        ? ps(
          e.self(),
          Vl(qD),
          Ll({
            onNone: () => e.setSelf(UD(new _m(), { previous: e.self() })),
            onSome: (t) => e.setSelf(zD(t)),
          }),
        )
        : e.setSelf(HD(t, { previous: e.self() })),
        Vh)
      ),
    ),
    o = PO(r.pipe(Tu($D, e.registry), Tu(_d, e.registry.scheduler)), a, fs, !1);
  return o !== void 0 && e.addFinalizer(o), i._tag === `Some` ? PD(i) : WD(n);
}
var RO = (e, t, n = Su()) =>
    Fv(t)
      ? (e.addFinalizer(
        Iv(t).pipe(
          wv((t) => {
            for (let n = 0; n < t.length; n++) e.setSelf(t[n]);
            return Vh;
          }),
          Tg(n),
        ),
      ),
        Og(n)(Lv(t)))
      : t._tag === `Success`
      ? LO(e, Iv(t.value), LD(!0), n)
      : t,
  zO = (e, t) => {
    function n(t, n) {
      let r = t.get(e);
      Fv(r) ? Dg(zv(r, n)) : RD(r) && Dg(zv(r.value, n));
    }
    return TO((n) => {
      let r = n(e);
      return Fv(r) || RD(r) ? t(n, r) : r;
    }, n);
  },
  BO = Symbol.for(`effect/reactivity/atom/Atom/Reset`),
  VO = Symbol.for(`effect/reactivity/atom/Atom/Interrupt`),
  HO = function (...e) {
    return e.length === 0 ? UO : UO(...e);
  },
  UO = (e, t) => {
    let [n, r] = WO(e, t);
    return TO(n, r);
  };
function WO(e, t) {
  let n = vO(jO([0, void 0])),
    r = t?.initialValue === void 0 ? LD() : zD(t.initialValue),
    i = t?.concurrent
      ? vO(wO((e) => {
        let t = new Set();
        return e.addFinalizer(() => t.forEach((e) => e.interruptUnsafe())), t;
      }))
      : void 0;
  function a(t, a) {
    let o = i ? t(i) : void 0;
    t.isFn = !0;
    let [s, c] = t.get(n);
    if (s === 0) return r;
    if (c === VO) return HD(hm(), { previous: t.self() });
    let l = e(c, t);
    return kO in l
      ? (o &&
        (l = Jh(
          Cg(l, { startImmediately: !0 }),
          (e) => (o.add(e),
            e.addObserver(() => o.delete(e)),
            Qh(jg(o), (e) =>
              e[0])),
        )),
        NO(t, l, r, a, !1))
      : LO(t, l, r, a);
  }
  function o(e, t) {
    XO(() => {
      t === BO
        ? e.set(n, [0, void 0])
        : t === VO
        ? e.set(n, [e.get(n)[0] + 1, VO])
        : e.set(n, [e.get(n)[0] + 1, t]), e.refreshSelf();
    });
  }
  return [a, o, n];
}
var GO = (e, t, n, r) =>
    Jh(Tv(typeof n == `function` ? n(e) : n), (n) => {
      let i = Mg().context,
        a = $l(),
        o = cg(n, {
          onFailure(e) {
            return uh(e)
              ? Yl(a)
                ? G({ done: !0, items: a })
                : Gh(new _m(`Atom.pull: no items`))
              : Kh(e);
          },
          onSuccess(e) {
            let t;
            return r?.disableAccumulation ? t = e : (t = ql(a, e), a = t),
              G({ done: !1, items: t });
          },
        }),
        s = new Set();
      return e.addFinalizer(() => {
        for (let e of s) e();
      }),
        e.once(t),
        e.subscribe(t, () => {
          e.setSelf(PD(e.self()));
          let t;
          t = PO(i, o, (n) => {
            t && s.delete(t);
            let r = ND(n, e.self()), i = s.size > 0;
            e.setSelf(i ? WD(r) : r);
          }), t && s.add(t);
        }),
        o;
    }),
  KO = (e, t) =>
    TO(t.read, function (t, n) {
      t.set(e, t.get(e) + 1);
    }),
  qO = (e) =>
    Object.assign(Object.create(Object.getPrototypeOf(e)), {
      ...e,
      keepAlive: !0,
    }),
  JO = F((e) => gO(e[0]), (e, t, n) => {
    let r = vO(
      CO(e)
        ? TO(
          (n) => t(n, e),
          function (t, n) {
            t.set(e, n);
          },
          e.refresh ?? function (t) {
            t(e);
          },
        )
        : wO(
          (n) => t(n, e),
          e.refresh ?? function (t) {
            t(e);
          },
        ),
    );
    return n?.initialValueTarget &&
      (r.initialValueTarget = YO(n.initialValueTarget)),
      r;
  }),
  YO = (e) => {
    let t = e;
    for (; t.initialValueTarget;) t = t.initialValueTarget;
    return t;
  },
  XO = pO,
  ZO = N(
    `<section class=panel><header><h2>Typeahead search</h2><p>The same search Effect runs through <code>Atom.fn</code>. Writes update one registry atom;<code>concurrent: false</code> interrupts the previous request.</p></header><input id=atom-package-search name=package-search type=search aria-label="Search packages"placeholder="Search packages… (try typing “solid” quickly)"autofocus>`,
  ),
  QO = N(`<p class=loading>Searching…`),
  $O = N(`<ul>`),
  ek = N(`<div class=results>`),
  tk = N(
    `<div class=error-box><p>Search gave up after retries: </p><button>Try again`,
  ),
  nk = N(`<p class=empty>No packages match “<!>”.`),
  rk = N(
    `<li><div><span class=pkg-name></span><span class=pkg-desc></span></div><span class=pkg-downloads>/wk`,
  ),
  ik = N(`<button class=danger>Cancel checkout`),
  ak = N(`<ul class=orders>`),
  ok = N(
    `<section class=panel><header><h2>Checkout saga</h2><p><code>Atom.fn</code> owns the cancellable workflow. State writes happen through the registry, while Effect handles typed decline and interruption compensation.</p></header><div class=cart><div class="cart-row total"><span class=cart-name>Total</span><span class=cart-price>$</span></div></div><div class=checkout-controls><label class=decline-toggle><input id=atom-decline-card name=decline-card type=checkbox>Simulate card decline (typed <code>CardDeclinedError</code>)</label></div><ol class=steps></ol><h3>Your orders</h3><!>`,
  ),
  sk = N(
    `<div class=cart-row><span class=cart-name></span><span class=qty><button>−</button><button>+</button></span><span class=cart-price>$`,
  ),
  ck = N(`<button class=primary>Place order — $`),
  lk = N(`<li>`),
  uk = N(`<p>`),
  dk = N(`<p class=loading>Loading orders…`),
  fk = N(`<p class=empty>No orders yet.`),
  pk = N(
    `<li><span class=pkg-name></span><span class=pkg-desc> line<!> · placed <!></span><span class=cart-price>$`,
  ),
  mk = N(
    `<div class=atom-demos><section class=comparison-note><strong>Registry comparison</strong><span>These are the same two flows using Effect Atom primitives. The released<code>@effect/atom-solid</code> adapter is still Solid 1-only, so this Solid 2 tab uses the equivalent bridge above.</span></section><!><!>`,
  ),
  hk = Xa();
function gk() {
  let e = Za(hk);
  if (!e) {
    throw Error(`Atom components must be rendered inside RegistryProvider`);
  }
  return e;
}
function _k(e) {
  let t = gk(), n = no(e), [r, i] = ro(_n(() => t.get(n())));
  return lo(
    () => n(),
    (e) => t.subscribe(e, (e) => i(() => e), { immediate: !0 }),
  ),
    r;
}
function vk(e) {
  let t = gk(), n = no(e);
  return [_k(n), (e) => t.set(n(), e)];
}
function yk(e) {
  let t = QD();
  return vr(() => t.dispose()),
    M(hk, {
      value: t,
      get children() {
        return e.children;
      },
    });
}
function bk(e) {
  return e >= 1e6
    ? (e / 1e6).toFixed(1) + `M`
    : e >= 1e3
    ? Math.round(e / 1e3) + `k`
    : String(e);
}
function xk() {
  let [e, t] = ro(``),
    n = HO()((e) => Xv(e).pipe(dg(Yv)), { concurrent: !1 }),
    [r, i] = vk(() => n),
    a = () => {
      let e = r();
      return e.waiting || FD(e);
    },
    o = () => {
      let e = r();
      return BD(e) ? gm(e.cause) : void 0;
    },
    s = () => JD(r(), () => []);
  var c = ZO(), l = c.firstChild.nextSibling;
  return l.$$input = (e) => {
    let n = e.currentTarget.value, r = n.trim();
    t(n), i(r || BO);
  },
    P(
      c,
      M(mo, {
        get when() {
          return e().trim();
        },
        children: (e) =>
          M(ho, {
            get children() {
              return [
                M(go, {
                  get when() {
                    return o();
                  },
                  children: (t) =>
                    (() => {
                      var n = tk(), r = n.firstChild;
                      r.firstChild;
                      var a = r.nextSibling;
                      return P(r, () => String(t()), null),
                        a.$$click = () => i(e().trim()),
                        n;
                    })(),
                }),
                M(go, {
                  get when() {
                    return FD(r());
                  },
                  get children() {
                    return QO();
                  },
                }),
                M(go, {
                  when: !0,
                  get children() {
                    var t = ek();
                    return P(
                      t,
                      M(mo, {
                        get when() {
                          return s().length > 0;
                        },
                        get fallback() {
                          var t = nk(), n = t.firstChild.nextSibling;
                          return n.nextSibling, P(t, e, n), t;
                        },
                        get children() {
                          var e = $O();
                          return P(
                            e,
                            M(po, {
                              get each() {
                                return s();
                              },
                              children: (e) =>
                                (() => {
                                  var t = rk(),
                                    n = t.firstChild,
                                    r = n.firstChild,
                                    i = r.nextSibling,
                                    a = n.nextSibling,
                                    o = a.firstChild;
                                  return P(r, () => e.name),
                                    P(i, () => e.description),
                                    P(a, () => bk(e.downloads), o),
                                    t;
                                })(),
                            }),
                          ),
                            e;
                        },
                      }),
                    ),
                      Co(() => !!a(), (e) => {
                        t.classList.toggle(`stale`, e);
                      }),
                      t;
                  },
                }),
              ];
            },
          }),
      }),
      null,
    ),
    Co(() => e(), (e) => {
      l.value = e ?? ``;
    }),
    c;
}
var Sk = [{ phase: `reserving`, label: `Reserve inventory` }, {
    phase: `charging`,
    label: `Charge card`,
  }, { phase: `finalizing`, label: `Create order` }],
  Ck = [{
    id: `sku_signal`,
    name: `Signal (fine-grained)`,
    price: 19.99,
    quantity: 1,
  }, {
    id: `sku_fiber`,
    name: `Fiber (interruptible)`,
    price: 24.5,
    quantity: 2,
  }, {
    id: `sku_boundary`,
    name: `Boundary (loading)`,
    price: 9.75,
    quantity: 1,
  }];
function wk() {
  let e = DO(Ck.map((e) => ({ ...e }))),
    t = DO(`idle`),
    n = DO(null),
    r = DO(!1),
    i = DO(zh(() => ey())),
    a = HO()((e, r) => {
      let a,
        o,
        s = e.items.reduce((e, t) => e + t.price * t.quantity, 0),
        c = () =>
          Wh(function* () {
            o && (yield* ry(o)), a && (yield* ny(a));
          }),
        l = (e) =>
          K(() => {
            r.registry.set(t, `idle`), r.registry.set(n, e);
          });
      return Wh(function* () {
        yield* K(() => {
          r.registry.set(n, null), r.registry.set(t, `reserving`);
        }),
          a = yield* ty(e.items),
          yield* K(() => r.registry.set(t, `charging`)),
          o = yield* iy(s, e.decline),
          yield* K(() => r.registry.set(t, `finalizing`));
        let c = yield* ay(e.items, a, o);
        return yield* K(() => {
          r.registry.set(t, `idle`),
            r.registry.set(n, {
              kind: `success`,
              text: `Order ${c.id} confirmed — $${c.total.toFixed(2)}`,
            }),
            r.registry.refresh(i);
        }),
          c;
      }).pipe(
        ng((e) => e instanceof Zv, (e) =>
          c().pipe(
            Xh(
              l({
                kind: `error`,
                text: `Card declined for $${
                  e.amount.toFixed(2)
                } — refunds/releases applied, cart untouched`,
              }),
            ),
            Xh(Gh(e)),
          )),
        yg(() =>
          c().pipe(
            Xh(
              l({
                kind: `info`,
                text: `Checkout cancelled — compensations ran, cart untouched`,
              }),
            ),
          )
        ),
      );
    }, { concurrent: !1 }),
    [o, s] = vk(() => e),
    [c] = vk(() => t),
    [l] = vk(() => n),
    [u, d] = vk(() => r),
    f = _k(() => i),
    [, p] = vk(() => a),
    m = () => o().reduce((e, t) => e + t.price * t.quantity, 0),
    h = () => c() !== `idle`,
    g = () => JD(f(), () => []),
    _ = () => {
      let e = f();
      return e.waiting || FD(e);
    },
    v = (e) => {
      let t = [`reserving`, `charging`, `finalizing`],
        n = t.indexOf(c()),
        r = t.indexOf(e);
      return n === -1 ? `` : r < n ? `done` : r === n ? `active` : ``;
    };
  var ee = ok(),
    te = ee.firstChild.nextSibling,
    ne = te.firstChild,
    re = ne.firstChild.nextSibling;
  re.firstChild;
  var ie = te.nextSibling,
    ae = ie.firstChild.firstChild,
    oe = ie.nextSibling,
    se = oe.nextSibling,
    ce = se.nextSibling;
  return P(
    te,
    M(po, {
      get each() {
        return o();
      },
      children: (e, t) =>
        (() => {
          var n = sk(),
            r = n.firstChild,
            i = r.nextSibling,
            a = i.firstChild,
            c = a.nextSibling,
            l = i.nextSibling;
          return l.firstChild,
            P(r, () => e.name),
            a.$$click = () =>
              s(
                o().map((e, n) =>
                  n === t() ? { ...e, quantity: e.quantity - 1 } : e
                ),
              ),
            P(i, () => e.quantity, c),
            c.$$click = () =>
              s(
                o().map((e, n) =>
                  n === t() ? { ...e, quantity: e.quantity + 1 } : e
                ),
              ),
            P(l, () => (e.price * e.quantity).toFixed(2), null),
            Co(() => ({ e: h() || e.quantity <= 1, t: h() }), ({ e, t }, n) => {
              e !== n?.e && Ho(a, `disabled`, e),
                t !== n?.t && Ho(c, `disabled`, t);
            }),
            n;
        })(),
    }),
    ne,
  ),
    P(re, () => m().toFixed(2), null),
    ae.$$input = (e) => d(e.currentTarget.checked),
    P(
      ie,
      M(mo, {
        get when() {
          return h();
        },
        get fallback() {
          var e = ck();
          return e.firstChild,
            e.$$click = () =>
              p({ items: o().map((e) => ({ ...e })), decline: u() }),
            P(e, () => m().toFixed(2), null),
            e;
        },
        get children() {
          var e = ik();
          return e.$$click = () => p(VO), e;
        },
      }),
      null,
    ),
    P(
      oe,
      M(po, {
        each: Sk,
        children: (e) =>
          (() => {
            var t = lk();
            return P(t, () => e.label),
              Co(
                () => ({
                  e: v(e.phase) === `done`,
                  t: v(e.phase) === `active`,
                }),
                ({ e, t: n }, r) => {
                  e !== r?.e && t.classList.toggle(`done`, e),
                    n !== r?.t && t.classList.toggle(`active`, n);
                },
              ),
              t;
          })(),
      }),
    ),
    P(
      ee,
      M(mo, {
        get when() {
          return l();
        },
        children: (e) =>
          (() => {
            var t = uk();
            return P(t, () => e().text),
              Co(() => `notice ${e().kind}`, (e, n) => {
                Uo(t, e, n);
              }),
              t;
          })(),
      }),
      se,
    ),
    P(
      ee,
      M(mo, {
        get when() {
          return !_();
        },
        get fallback() {
          return dk();
        },
        get children() {
          return M(mo, {
            get when() {
              return g().length > 0;
            },
            get fallback() {
              return fk();
            },
            get children() {
              var e = ak();
              return P(
                e,
                M(po, {
                  get each() {
                    return g();
                  },
                  children: (e) =>
                    (() => {
                      var t = pk(),
                        n = t.firstChild,
                        r = n.nextSibling,
                        i = r.firstChild,
                        a = i.nextSibling,
                        o = a.nextSibling.nextSibling,
                        s = r.nextSibling;
                      return s.firstChild,
                        P(n, () => e.id),
                        P(r, () => e.items.length, i),
                        P(r, () => e.items.length === 1 ? `` : `s`, a),
                        P(r, () => e.placedAt, o),
                        P(s, () => e.total.toFixed(2), null),
                        t;
                    })(),
                }),
              ),
                e;
            },
          });
        },
      }),
      ce,
    ),
    Co(() => u(), (e) => {
      ae.checked = e;
    }),
    ee;
}
function Tk() {
  return M(yk, {
    get children() {
      var e = mk(), t = e.firstChild.nextSibling, n = t.nextSibling;
      return P(e, M(xk, {}), t), P(e, M(wk, {}), n), e;
    },
  });
}
No([`input`, `click`]);
var Ek = N(`<ul>`),
  Dk = N(`<aside class=log-panel><header><h2>Fiber events</h2><button>Clear`),
  Ok = N(`<p class=empty>Interact to see fiber lifecycle events.`),
  kk = N(
    `<li><span class=log-time></span><span class=log-kind></span><span class=log-msg>`,
  ),
  Ak = N(
    `<div class=app><header class=app-header><h1>Solid 2.0 <span class=times>×</span> Effect</h1><p>Two demos, one tiny integration (<code>src/solid-effect.ts</code>): Effects as interruptible async sources on the read path, Effect sagas as transaction steps on the action path, services provided through Solid context.</p><nav class=tabs><button>Typeahead <small>read path</small></button><button>Checkout <small>action path</small></button><button>Atom <small>registry comparison</small></button></nav></header><main><!><!>`,
  ),
  jk = N(
    `<div class="error-box app-error"><p>Something went wrong: </p><button>Reset`,
  );
function Mk() {
  var e = Dk(), t = e.firstChild.firstChild.nextSibling;
  return Wo(t, `click`, Gv, !0),
    P(
      e,
      M(mo, {
        get when() {
          return Hv.length > 0;
        },
        get fallback() {
          return Ok();
        },
        get children() {
          var e = Ek();
          return P(
            e,
            M(po, {
              get each() {
                return [...Hv].reverse();
              },
              children: (e) =>
                (() => {
                  var t = kk(),
                    n = t.firstChild,
                    r = n.nextSibling,
                    i = r.nextSibling;
                  return P(n, () => e.time),
                    P(r, () => e.kind),
                    P(i, () => e.message),
                    Co(() => `log-${e.kind}`, (e, n) => {
                      Uo(t, e, n);
                    }),
                    t;
                })(),
            }),
          ),
            e;
        },
      }),
      null,
    ),
    e;
}
function Nk() {
  let [e, t] = ro(`typeahead`);
  return M(_o, {
    fallback: (e, t) => {
      console.error(`solid-effect-render-error`, e());
      var n = jk(), r = n.firstChild;
      r.firstChild;
      var i = r.nextSibling;
      return P(r, () => String(e()), null), Wo(i, `click`, t, !0), n;
    },
    get children() {
      return M(iD, {
        get value() {
          return oD(Yv);
        },
        get children() {
          var n = Ak(),
            r = n.firstChild,
            i = r.firstChild.nextSibling.nextSibling.firstChild,
            a = i.nextSibling,
            o = a.nextSibling,
            s = r.nextSibling,
            c = s.firstChild,
            l = c.nextSibling;
          return i.$$click = () => t(`typeahead`),
            a.$$click = () => t(`checkout`),
            o.$$click = () => t(`atom`),
            P(
              s,
              M(mo, {
                get when() {
                  return e() === `typeahead`;
                },
                get fallback() {
                  return M(mo, {
                    get when() {
                      return e() === `checkout`;
                    },
                    get fallback() {
                      return M(Tk, {});
                    },
                    get children() {
                      return M(jD, {});
                    },
                  });
                },
                get children() {
                  return M(vD, {});
                },
              }),
              c,
            ),
            P(s, M(Mk, {}), l),
            Co(
              () => ({
                e: e() === `typeahead`,
                t: e() === `typeahead` ? `true` : `false`,
                a: e() === `checkout`,
                o: e() === `checkout` ? `true` : `false`,
                i: e() === `atom`,
                n: e() === `atom` ? `true` : `false`,
              }),
              ({ e, t, a: n, o: r, i: s, n: c }, l) => {
                e !== l?.e && i.classList.toggle(`selected`, e),
                  t !== l?.t && Ho(i, `aria-pressed`, t),
                  n !== l?.a && a.classList.toggle(`selected`, n),
                  r !== l?.o && Ho(a, `aria-pressed`, r),
                  s !== l?.i && o.classList.toggle(`selected`, s),
                  c !== l?.n && Ho(o, `aria-pressed`, c);
              },
            ),
            n;
        },
      });
    },
  });
}
No([`click`]), jo(() => M(Nk, {}), document.getElementById(`root`));
