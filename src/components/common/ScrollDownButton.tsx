import { ArrowDownIcon } from "../icons";

export const ScrollDownButton = ({ count, onClick }: { count: number; onClick: () => void }) => {
    if (count === 0) return null;

    return (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10">
            <button
                onClick={onClick}
                className="flex cursor-pointer items-center justify-center h-10 gap-2 px-4 rounded-full bg-cyan-600/90 backdrop-blur-sm text-white shadow-lg transition-all hover:scale-105 hover:bg-cyan-500"
            >
                <ArrowDownIcon />
                <span className="font-semibold text-sm">
                    {count} new message{count > 1 ? 's' : ''}
                </span>
            </button>
        </div>
    );
};