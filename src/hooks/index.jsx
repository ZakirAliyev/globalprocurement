import { useEffect, useState } from "react";

export default function usePageLoader(isAnyLoading) {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        if (!isAnyLoading) {
            const timeout = setTimeout(() => {
                setShowLoader(false);
            }, 1250);
            return () => clearTimeout(timeout);
        } else {
            setShowLoader(true);
        }
    }, [isAnyLoading]);

    return showLoader;
}
