import { motion } from 'framer-motion';

const AnimatedCard = ({ children, className = '', delay = 0, noHover = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={!noHover ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      className={`bg-white dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700/50 overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
