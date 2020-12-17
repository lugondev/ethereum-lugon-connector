// @ts-ignore
import withReactContent from "sweetalert2-react-content/dist/sweetalert2-react-content.es.min";

const Alert = withReactContent(require("sweetalert2"));

interface INotify {
    type: string,
    message: string,
}

export const Notify: any = ({type, message}: INotify) => {
    return Alert.mixin({
        toast: true,
        icon: type || "success",
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    }).fire({
        title: message
    })
};

export function onSuccessCopy(message?: string) {
    return () => {
        Alert.mixin({
            toast: true,
            position: 'top',
            icon: "success",
            showConfirmButton: false,
            timer: 1000
        }).fire({
            title: !!message ? message : "copied",
        }).catch()
    }
}
