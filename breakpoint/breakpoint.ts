type BreakpointName = "xs" | "sm" | "md" | "lg" | "xl";

interface BreakpointThresholds {
  xs: number;
  sm: number;
  md: number;
  lg: number;
}

interface BreakpointImpl {
  height: number;
  lg: boolean;
  lgAndDown: boolean;
  lgAndUp: boolean;
  lgOnly: boolean;
  md: boolean;
  mdAndDown: boolean;
  mdAndUp: boolean;
  mdOnly: boolean;
  name: BreakpointName;
  sm: boolean;
  smAndDown: boolean;
  smAndUp: boolean;
  smOnly: boolean;
  width: number;
  xl: boolean;
  xlOnly: boolean;
  xs: boolean;
  xsOnly: boolean;
  mobile: boolean;
  mobileBreakpoint: number | BreakpointName;
  thresholds: BreakpointThresholds;
  scrollBarWidth: number;
}

export type Preset = {
  /** 设置该值，当可视窗口宽度小于或等于该值时，那么mobile将为true，或者使用预设值xs、sm、md、lg、xl */
  mobileBreakpoint: number | BreakpointName;
  /** 设置预设值 */
  thresholds: BreakpointThresholds;
  /** 设置当前窗口滚动条的宽度，如修改了滚动条的宽度，请覆盖 */
  scrollBarWidth: number;
};

export class Breakpoint implements BreakpointImpl {
  public xs = false;

  public sm = false;

  public md = false;

  public lg = false;

  public xl = false;

  public xsOnly = false;

  public smOnly = false;

  public smAndDown = false;

  public smAndUp = false;

  public mdOnly = false;

  public mdAndDown = false;

  public mdAndUp = false;

  public lgOnly = false;

  public lgAndDown = false;

  public lgAndUp = false;

  public xlOnly = false;

  public name: BreakpointImpl["name"] = "xs";

  public height = 0;

  public width = 0;

  public mobile = true;

  public mobileBreakpoint: BreakpointImpl["mobileBreakpoint"];

  public thresholds: BreakpointImpl["thresholds"];

  public scrollBarWidth: BreakpointImpl["scrollBarWidth"];

  private resizeTimer = 0;

  constructor(preset: Preset) {
    const { mobileBreakpoint, scrollBarWidth, thresholds } = preset;

    this.mobileBreakpoint = mobileBreakpoint;
    this.scrollBarWidth = scrollBarWidth;
    this.thresholds = thresholds;
  }

  public init() {
    this.update();

    if (!window) return;

    window.addEventListener("resize", this.onResize.bind(this), {
      passive: true
    });
  }

  update() {
    const height = this.getClientHeight();
    const width = this.getClientWidth();

    const xs = width < this.thresholds.xs;
    const sm = width < this.thresholds.sm && !xs;
    const md = width < this.thresholds.md - this.scrollBarWidth && !(sm || xs);
    const lg =
      width < this.thresholds.lg - this.scrollBarWidth && !(md || sm || xs);
    const xl = width >= this.thresholds.lg - this.scrollBarWidth;

    this.height = height;
    this.width = width;

    this.xs = xs;
    this.sm = sm;
    this.md = md;
    this.lg = lg;
    this.xl = xl;

    this.xsOnly = xs;
    this.smOnly = sm;
    this.smAndDown = (xs || sm) && !(md || lg || xl);
    this.smAndUp = !xs && (sm || md || lg || xl);
    this.mdOnly = md;
    this.mdAndDown = (xs || sm || md) && !(lg || xl);
    this.mdAndUp = !(xs || sm) && (md || lg || xl);
    this.lgOnly = lg;
    this.lgAndDown = (xs || sm || md || lg) && !xl;
    this.lgAndUp = !(xs || sm || md) && (lg || xl);
    this.xlOnly = xl;

    const breakpoints = {
      xs: 0,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4
    };

    const names = Array<BreakpointName>("xs", "sm", "md", "lg", "xl");
    this.name = names.find(v => (this[v] ? v : false)) || "xl";
    if (typeof this.mobileBreakpoint === "number") {
      this.mobile = width < parseInt(`${this.mobileBreakpoint}`, 10);

      return;
    }

    const current = breakpoints[this.name];
    const max = breakpoints[this.mobileBreakpoint];

    // 当前页面宽度是否小于、等于设置的mobileBreakpoint
    this.mobile = current <= max;
    console.log("breakpoint ->", this);
  }

  onResize() {
    clearTimeout(this.resizeTimer);

    // 页面渲染耗时大概是200毫秒
    this.resizeTimer = setTimeout(this.update.bind(this), 200);
  }

  remove() {
    window.removeEventListener("resize", this.onResize);
  }

  private getClientWidth() {
    if (!document) return 0;
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  private getClientHeight() {
    if (!document) return 0;
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }
}
