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
    <div className="h-4 w-full relative overflow-hidden rounded bg-muted/50">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent"
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
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-muted/30 h-12">
          <TableRow>
            {Array.from({ length: columnsCount }).map((_, i) => (
              <TableHead key={i}>
                 <div className="h-4 w-24 bg-muted animate-pulse rounded-full opacity-50" />
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
