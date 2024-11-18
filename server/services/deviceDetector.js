const deviceDetector=(userClient)=>{
    const isBrowser = ["Chrome", "Safari", "Edge", "Firefox"].some((browser) =>
      userClient.includes(browser)
    );
    return isBrowser;
}

export default deviceDetector;