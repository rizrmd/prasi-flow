import { useEffect, useRef, useState } from "react";

export const useLocal = <T extends object>(
  data: T,
  effect?: (arg: {
    init: boolean;
    setDelayedRender: (arg: boolean) => void;
  }) => Promise<void | (() => void)> | void | (() => void),
  deps?: any[],
): {
  [K in keyof T]: T[K] extends Promise<any> ? null | Awaited<T[K]> : T[K];
} & { render: () => void } => {
  const [, _render] = useState({});
  const _ = useRef({
    data: data as unknown as T & {
      render: () => void;
    },
    deps: (deps || []) as any[],
    ready: false,
    _loading: {} as any,
    lastRender: 0,
    lastRenderCount: 0,
    delayedRender: false,
    delayedRenderTimeout: null as any,
    overRenderTimeout: null as any,
  });
  const local = _.current;

  useEffect(() => {
    local.ready = true;
    if (effect)
      effect({
        init: true,
        setDelayedRender(arg) {
          local.delayedRender = arg;
        },
      });
  }, []);

  if (!local.ready) {
    local._loading = {};

    local.data.render = () => {
      if (local.ready) {
        if (local.delayedRender) {
          if (Date.now() - local.lastRender > 100) {
            local.lastRender = Date.now();
            _render({});
          } else {
            clearTimeout(local.delayedRenderTimeout);
            local.delayedRenderTimeout = setTimeout(local.data.render, 50);
          }
          return;
        }

        if (Date.now() - local.lastRender < 300) {
          local.lastRenderCount++;
        } else {
          local.lastRenderCount = 0;
        }

        local.lastRender = Date.now();

        if (local.lastRenderCount > 1000) {
          clearTimeout(local.overRenderTimeout);
          local.overRenderTimeout = setTimeout(() => {
            local.lastRenderCount = 0;
            local.lastRender = Date.now();
            _render({});
          }, 1000);

          console.error(
            `local.render executed ${local.lastRenderCount} times in less than 300ms`,
          );
          return;
        }

        _render({});
      }
    };
  } else {
    if (local.deps.length > 0 && deps) {
      for (const [k, dep] of Object.entries(deps) as any) {
        if (local.deps[k] !== dep) {
          local.deps[k] = dep;

          if (effect) {
            setTimeout(() => {
              effect({
                init: false,
                setDelayedRender(arg) {
                  local.delayedRender = arg;
                },
              });
            });
          }
          break;
        }
      }
    }
  }

  return local.data as any;
};
