import React, { useRef, useCallback } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          image: Yup.string().required('Imagem obrigatória'),
          name: Yup.string().required('Nome obrigatório'),
          price: Yup.number().required(),
          description: Yup.string().required('Descrição obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        handleAddFood(data);
        setIsOpen();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          formRef.current?.setErrors(err);
        }
      }
    },

    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <h4>URL da imagem</h4>
        <Input name="image" placeholder="Cole o link aqui" />
        <h4>Nome do prato</h4>
        <Input name="name" placeholder="Ex: Moda Italiana" />
        <h4>Preço</h4>
        <Input name="price" placeholder="Ex: 19.90" />
        <h4>Descrição do prato</h4>
        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
