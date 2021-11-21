const tokenBalance = (balance: string | number, decimals: string | number) => {
  return (Number(balance) / 10 ** Number(decimals)).toFixed(2);
};

export default tokenBalance;
