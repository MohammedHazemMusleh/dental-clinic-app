const ToothIcon = ({ size = 18, className = "" }) => {
  const TOOTH_PATH =
    "M12 2c-2.2 0-3.6 1.1-4.6 1.1-1 0-2-1-3.4-1C2 2 1 3.7 1 6.2c0 2.9 1 6.9 2.1 9.6.9 2.2 1.9 3.9 3 4.7.7.5 1.2.5 1.6-.2.5-.9.7-2.7 1-4 .2-.9.5-1.4 1.3-1.4s1.1.5 1.3 1.4c.3 1.3.5 3.1 1 4 .4.7.9.7 1.6.2 1.1-.8 2.1-2.5 3-4.7C21 13.1 22 9.1 22 6.2 22 3.7 21 2 19 2c-1.4 0-2.4 1-3.4 1-1 0-2.4-1-4.6-1 0 0 .5 0 1 0z";

  return (
    <svg viewBox="0 0 23 22" width={size} height={size} className={className} fill="currentColor">
      <path d={TOOTH_PATH} />
    </svg>
  );
};

export default ToothIcon;