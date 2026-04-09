import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShimmerTableProps {
  columnsCount: number;
  rowCount?: number;
}

export function ShimmerTable({ columnsCount, rowCount = 5 }: ShimmerTableProps) {
  const shimmerVariants = {
    initial: {
      backgroundPosition: "-200px 0",
    },
    animate: {
      backgroundPosition: "200% 0",
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      } as const,
    },
  };

  const ShimmerLine = () => (
    <div className="h-4 w-full relative overflow-hidden rounded bg-gray-200 dark:bg-slate-800">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-slate-700/30 to-transparent"
        style={{
          backgroundSize: "200% 100%",
        }}
        variants={shimmerVariants}
        initial="initial"
        animate="animate"
      />
    </div>
  );

  return (
    <div className="rounded-lg border bg-white dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
      <Table>
        <TableHeader className="bg-muted dark:bg-slate-800 h-12">
          <TableRow>
            {Array.from({ length: columnsCount }).map((_, i) => (
              <TableHead key={i}>
                 <div className="h-4 w-24 bg-gray-300 dark:bg-slate-700 rounded-full animate-pulse opacity-50" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columnsCount }).map((_, colIndex) => (
                <TableCell key={colIndex} className="py-4">
                  <ShimmerLine />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
