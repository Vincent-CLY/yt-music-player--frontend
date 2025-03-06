export const handleMouseClick = useCallback(
    (e) => {
      if (!progressBarRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      const percentage = Math.min(Math.max((x / width) * 100, 0), 100);
      setProgress(percentage);
      console.log(percentage, duration);
      console.log(
        Math.min(Math.floor((duration * percentage) / 100), duration)
      );
      console.log(
        convertTime(
          Math.min(Math.floor((duration * percentage) / 100), duration)
        )
      );
      setCurrentTime(
        convertTime(
          Math.min(Math.floor((duration * percentage) / 100), duration)
        )
      );
    },
    [duration]
  );