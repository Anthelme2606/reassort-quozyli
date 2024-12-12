import React, { useState } from "react";
import "../assets/css/inventor.css";
import { Modal, Button } from 'react-bootstrap';
import ToggleSwitch from "./ToggleSwitch";

const InventoryManager = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://i.pinimg.com/736x/a0/fb/87/a0fb8797a488ba64bdad33b998427ec4.jpg",
      titre: "Produit 1",
      description: "Description du produit 1",
      prix: 19.99,
      quantite: 5,
      joursRestants: 3,
      paye: true,
    },
    {
      id: 2,
      image: "https://i.pinimg.com/736x/a0/fb/87/a0fb8797a488ba64bdad33b998427ec4.jpg",
      titre: "Produit 2",
      description: "Description du produit 2 a toi de voir la description qui va le mieux, tres specialement avec tres avec",
      prix: 29.99,
      quantite: 3,
      joursRestants: 7,
      paye: false,
    },
    {
      id: 3,
      image: "https://i.pinimg.com/736x/4d/8f/c4/4d8fc4fc3e490946a0e1fd7133d6b169.jpg",
      titre: "Produit 2",
      description: "Description du produit 2",
      prix: 29.99,
      quantite: 3,
      joursRestants: 7,
      paye: false,
    },
  ]);

  const [modal, setModal] = useState({ visible: false, product: null });

  const togglePayment = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, paye: !p.paye } : p))
    );
  };

  const removeProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const openModal = (product) => {
    if (!product.paye) setModal({ visible: true, product });
  };

  const closeModal = () => setModal({ visible: false, product: null });

  const updateProduct = (quantite, paye) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === modal.product.id ? { ...p, quantite, paye } : p
      )
    );
    closeModal();
  };

  const allPaid = products.every((p) => p.paye);

  return (
    <div className="container">
      <div className="header">
        <h1>Réapprovisionnement</h1>
        <div>
          <ToggleSwitch/>
        </div>
        <div>
          {/* <span className="badge badge-secondary">Automatique</span> */}
          <span className={`badge ${allPaid ? "badge-success" : "badge-danger"}`}>
            {allPaid ? "Réassort payé" : "Réassort non payé"}
          </span>
        </div>
      </div>
      <div className="products">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <img src={product.image} alt={product.titre} className="product-image" />
            <div className="product-content">
              <h2 className="product-title">{product.titre}</h2>
              <span
                className={`badge ${product.paye ? "badge-success" : "badge-danger"}`}
                onClick={() => togglePayment(product.id)}
              >
                {product.paye ? "Payé" : "Non payé"}
              </span>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <span className="product-price">{product.prix.toFixed(2)} €</span>
                <span className="product-quantity">Quantité: {product.quantite}</span>
              </div>
              <p className="product-days">
                {product.joursRestants} jours restants pour le ravitaillement
              </p>
              <div className="product-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => removeProduct(product.id)}
                >
                  Retirer
                </button>
                <button
                  className="btn btn-outline"
                  onClick={() => openModal(product)}
                  disabled={product.paye}
                >
                  {product.paye ? "Déjà payé" : "Mise à jour"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {
      <Modal show={modal.visible} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Mettre à jour la quantité du produit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="form-group">
          <label>Quantité</label>
          <input
            type="number"
            defaultValue={modal.product?.quantite}
            min="1"
            onChange={(e) =>
              setModal((prev) => ({
                ...prev,
                product: { ...prev.product, quantite: +e.target.value },
              }))
            }
            className="form-control"
          />
        </div>
        <div className="form-group mt-3">
          <label>
            <input
              type="checkbox"
              checked={modal.product?.paye}
              onChange={(e) =>
                setModal((prev) => ({
                  ...prev,
                  product: { ...prev.product, paye: e.target.checked },
                }))
              }
            />{" "}
            Produit payé
          </label>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={() =>
            updateProduct(modal.product?.quantite, modal.product?.paye)
          }
        >
          Confirmer
        </Button>
      </Modal.Footer>
    </Modal>
    }
    </div>
  );
};

export default InventoryManager;
