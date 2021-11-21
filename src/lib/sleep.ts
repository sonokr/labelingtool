// 使い方
// (async () => {
//   await sleep(2000);
//   setLabel(label);
// })();

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(() => {})
    }, ms)
  })
}

export { sleep }
