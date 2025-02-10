'use client'
import { useContentType } from "@/app/context/contentTypeProvider";
import { Select, SelectItem } from "@heroui/select"
import React, { useState } from "react"

export const types = [
    {key: "movie", label: "Filmes"},
    {key: "tv", label: "TV Shows"},

  ];

const SelectContentType = () => {
    const {contentType, setContentType} = useContentType()

    const handleSelectionChange = (e) => {
        setContentType(e.target.value);
      };

    return (
        <Select
            className="max-w-xs"
            label="Contéudo"
            placeholder="Selecione um tipo"
            selectedKeys={[contentType]}
            variant="bordered"
            onChange={handleSelectionChange}
        >
            {types.map((type) => (
                <SelectItem key={type.key}>{type.label}</SelectItem>
            ))}
        </Select>
    )
}

export default SelectContentType
