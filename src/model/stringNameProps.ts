import { ControllerRenderProps } from "react-hook-form"

export type StringNameProps = {
    field: ControllerRenderProps<any, any>,
    //field: any,
    tips: string,
    enable: boolean,
    name: string,
    title: string,
    errors: any,
    text: any,
}
