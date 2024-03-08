import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Tabla_macanicos.css'
import { DeleteIcon } from "../Tabla_insumos_ot/DeleteIcon";

export const Tabla_mecanicos_ot = ({ formMecanicos, setFormMecanicos }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rowsMecanicos, setrowsMecanicos] = useState([]);

    const [aprendices, setAprendices] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/aprendices`)
            .then(datos => {
                setAprendices(datos.data);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            });
    }, []);

    const deleteRow = (id) => {
        setrowsMecanicos(rowsMecanicos.filter((_, idx) => idx !== id))
    }

    const addRow = (newRow) => {
        setrowsMecanicos([...rowsMecanicos, newRow])
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormMecanicos({
            ...formMecanicos,
            [name]: value
        });
    
        // Buscar el aprendiz seleccionado por su número de documento
        const aprendizSeleccionado = aprendices.find(aprendiz => aprendiz.num_doc_aprendiz === parseInt(value));
        if (aprendizSeleccionado) {
            // Autocompletar el campo de nombre
            setFormMecanicos(prevState => ({
                ...prevState,
                nombre: aprendizSeleccionado.nombre_aprendiz
            }));
        }
    }
    
console.log(formMecanicos)


    const handleSubmit = (e) => {
        addRow(formMecanicos);
    }

    return (
        <div>
            <div className="containerTIOT">
                <Table className='w-full'>
                    <TableHeader>
                        <TableColumn className="text-lg">Nombres</TableColumn>
                        <TableColumn className="text-lg ">Número Documento</TableColumn>
                        <TableColumn className="text-lg ">Eliminar</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {rowsMecanicos[0] ? rowsMecanicos.map((row, id) => {
                            return <TableRow key={id + 1}>
                                <TableCell className="text-lg">{row.nombre}</TableCell>
                                <TableCell className="text-lg">{row.documento}</TableCell>
                                <TableCell onClick={() => deleteRow(id)} className="text-red-500"><DeleteIcon /></TableCell>
                            </TableRow>
                        }) : <TableRow>
                            <TableCell className="text-lg text-slate-400">Nombre completo</TableCell>
                            <TableCell className="text-lg text-slate-400 ">No. Documento</TableCell>
                            <TableCell className="text-slate-400"><DeleteIcon /></TableCell>
                        </TableRow>}

                    </TableBody>
                </Table>
            </div>
            <div className="btn-registrarMOT">
                <Button onPress={onOpen}>Agregar mecánico</Button>
            </div>


            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} placement={"center"}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl">Registrar mecánico</ModalHeader>
                            <ModalBody className="modalIOT">
                                <div className="formIOT">

                                    <select className="select_insumosOT" name="documento" onChange={handleChange}>
                                        <option selected disabled hidden>Número de identificación</option>
                                        {aprendices.map(aprendiz => (
                                            <option value={aprendiz.num_doc_aprendiz} key={aprendiz.id_aprendiz}>{aprendiz.num_doc_aprendiz}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="formIOT">

                                    <Input placeholder="Nombre Completo" name="nombre" value={formMecanicos.nombre}/>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className='button-cerrar'>
                                    <Button className='text-slate-50 bg-red-500' variant="flat" onPress={onClose}>
                                        Cerrar
                                    </Button>
                                </div>
                                <div className='button-2-inp'>
                                    <Button className='text-white' type="submit" onPress={onClose} onClick={handleSubmit}>
                                        Registrar
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}