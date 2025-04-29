class GlobalErrorHandler {
  private static instance: GlobalErrorHandler

  private constructor() {
    // 注册全局错误处理
    window.addEventListener('error', this.handleError)
    window.addEventListener('unhandledrejection', this.handlePromiseError)
  }

  public static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler()
    }
    return GlobalErrorHandler.instance
  }

  private handleError(event: ErrorEvent): void {
    console.error('全局错误:', event.error)
    // 这里可以添加错误上报逻辑
  }

  private handlePromiseError(event: PromiseRejectionEvent): void {
    console.error('Promise错误:', event.reason)
    // 这里可以添加错误上报逻辑
  }
}

export { GlobalErrorHandler }
