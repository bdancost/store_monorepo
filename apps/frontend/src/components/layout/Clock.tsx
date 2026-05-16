import { motion, AnimatePresence } from "framer-motion";
import { useClock } from "../../hooks/useClock";

function Separator() {
  return (
    <motion.span
      animate={{ opacity: [1, 0.2, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      className="text-amber-400/60 mx-0.5 font-light"
    >
      :
    </motion.span>
  );
}

function Digit({ value }: { value: string }) {
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="inline-block tabular-nums"
      >
        {value}
      </motion.span>
    </AnimatePresence>
  );
}

export default function Clock() {
  const { hours, minutes, seconds, date } = useClock();

  return (
    <div className="flex flex-col items-end gap-0.5">
      {/* Hora */}
      <div className="flex items-center text-sm font-medium text-white/80 leading-none">
        <Digit value={hours} />
        <Separator />
        <Digit value={minutes} />
        <Separator />
        <Digit value={seconds} />
      </div>

      {/* Data */}
      {date && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[10px] text-white/30 tracking-wide hidden lg:block"
        >
          {date}
        </motion.span>
      )}
    </div>
  );
}
