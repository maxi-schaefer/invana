import DottedBackground from '../ui/dotted-background'

const Loading = ({ text }: { text?: string }) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <DottedBackground />
        <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full border-4 border-primary border-t-gray-400  dark:border-t-gray-900 h-12 w-12"/>
            {text && <p className="text-gray-500 dark:text-gray-400">{text}</p>}
        </div>
    </div>
  )
}

export default Loading