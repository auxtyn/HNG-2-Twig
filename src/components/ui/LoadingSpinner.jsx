const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-primary-500 animate-spin"></div>
        <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-primary-200 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
    </div>
  )
}

export default LoadingSpinner