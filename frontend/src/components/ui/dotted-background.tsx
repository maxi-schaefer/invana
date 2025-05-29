export default function DottedBackground() {
    return (
        <div className="z-[-1] absolute inset-0 h-full w-full bg-background bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_65%,transparent_100%)] dark:bg-background dark:bg-[radial-gradient(#212121_1px,transparent_1px)] dark:[mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#fff_65%,transparent_100%)]">
            <div className="absolute -top-20 left-20 w-110 h-110 bg-primary2/10 rounded-full blur-3xl" />
            <div className="absolute -top-20 left-20 w-110 h-110 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-0 right-10 w-110 h-110 bg-primary2/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-0 right-10 w-110 h-110 bg-primary3/10 rounded-full blur-3xl" />
        </div>
    );
}