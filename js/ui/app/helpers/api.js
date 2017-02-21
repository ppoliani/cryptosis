export default fetch = async url => {
  const response = await fetch(url);
  return response.json();
};
