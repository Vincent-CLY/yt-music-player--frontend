export const handleChange = (e, setIsValid, setIsEmpty, setplaylistURL) => {
    setIsValid(true); 
    if (e.target.value != '') {
      setIsEmpty(false);
      setplaylistURL(e.target.value);
      console.log(e.target.value);
    } else {
      setIsEmpty(true);
    }
  };