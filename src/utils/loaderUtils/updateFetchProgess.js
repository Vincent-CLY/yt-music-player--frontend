useEffect(() => {
    if (nowFetchProgress == 0) return;
    const timeout = setTimeout(() => {
      if (prevFetchProgress < nowFetchProgress) {
        setPrevFetchProgress((p) => p + 1);
      }
    }, 4);
    return () => clearTimeout(timeout);
  }, [nowFetchProgress, prevFetchProgress]);