import React from 'react'
import { useSelector } from 'react-redux'

const Input = ({ id, value, onChange, type = "text", pt, en, dataList }) => {
    const language = useSelector(state => state.loja.language);
    console.log(dataList);
    

    return (
        <>
            <label htmlFor={id} className="block text-sm font-medium text-gray-600">
                {language === "pt" ? pt : en}
            </label>
            <input
                type={type}  // dynamic type prop
                id={id}
                value={value}
                onChange={onChange}  // fixed event handler name
                list={`${id}-list`}  // dynamically linking the input with the datalist
                required
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
            />
            <datalist id={`${id}-list`}>
                {dataList.map((value, index) => (
                    <option key={index} value={value} />
                ))}
            </datalist>
        </>
    );
}

export default Input;
