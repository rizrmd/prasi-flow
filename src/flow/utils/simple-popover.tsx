import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Popover } from "@radix-ui/react-popover";
import { FC, ReactElement } from "react";

export const SimplePopover: FC<{
  content?: ReactElement;
  children: ReactElement;
  className?: string;
  disabled?: boolean;
}> = ({ content, children, className, disabled }) => {
  const local = useLocal({ open: false });
  if (disabled) return children;
  return (
    <Popover
      open={local.open}
      onOpenChange={(open) => {
        local.open = open;
        local.render();
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className={cx(className)}>{content}</PopoverContent>
    </Popover>
  );
};
