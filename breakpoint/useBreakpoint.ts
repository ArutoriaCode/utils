import { Breakpoint } from "./breakpoint";
import { onBeforeUnmount, reactive } from "vue";
function useBreakpoint() {
  const breakpoint = reactive(
    new Breakpoint({
      mobileBreakpoint: "sm",
      scrollBarWidth: 16,
      thresholds: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1264
      }
    })
  );

  breakpoint.init();

  onBeforeUnmount(() => {
    breakpoint.remove();
  });

  return breakpoint;
}

export default useBreakpoint;
