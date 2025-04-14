import React, {  useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIssue,  setVehicle } from "../../../redux/user";
import { brands } from "../../../utils/marcas";
import { issuesCategories } from "../../../utils/issues";
const VehicleInformation = ({ handleNext,handlePrev }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.loja.language);
  const vehicle = useSelector((state) => state.user.vehicle);
  const loading = useSelector((state) => state.application.loading);
  const [filteredModels, setFilteredModels] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const issue = useSelector((state) => state.user.issue);
  const t = (pt, en) => language === "pt" ? pt : en;


  const handleBrandChange = (e) => {
    const brand = e.target.value;
    dispatch(setVehicle({ ...vehicle, brand }));

    const brandData = brands.find((b) => b.brand.toLowerCase() === brand.toLowerCase());
    setFilteredModels(brandData ? brandData.models : []);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    dispatch(setVehicle({ ...vehicle, [id]: value }));
  };
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    dispatch(setIssue({ ...issue, category }));
    dispatch(setVehicle({ ...vehicle, category }));

    const categoryData = issuesCategories.find((c) => c.title.toLowerCase() === category.toLowerCase());
    setFilteredIssues(categoryData ? categoryData.issues : []);
  };


  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        {t("Informações do Veículo", "Vehicle Information")}
      </h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-600">
              {t("Marca do Veículo", "Vehicle Brand")}
            </label>
            <input
              id="brand"
              type="text"
              value={vehicle.brand || ""}
              onChange={handleBrandChange}
              list="brand-list"
              className="input w-full py-2 px-3 rounded-md border-gray-300"
              autoComplete="off"
              required
            />
            <datalist id="brand-list">
              {brands.map((b, i) => <option key={i} value={b.brand} />)}
            </datalist>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-600">
              {t("Modelo do Veículo", "Vehicle Model")}
            </label>
            <input
              id="model"
              type="text"
              value={vehicle.model || ""}
              onChange={handleInputChange}
              list="model-list"
              className="input w-full py-2 px-3 rounded-md border-gray-300"
              autoComplete="off"
              required
            />
            <datalist id="model-list">
              {filteredModels.map((model, i) => <option key={i} value={model} />)}
            </datalist>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="plate" className="block text-sm font-medium text-gray-600">
              {t("Placa do Veículo", "Vehicle License Plate")}
            </label>
            <input
              id="plate"
              type="text"
              value={vehicle.plate || ""}
              onChange={handleInputChange}
              className="input w-full py-2 px-3 rounded-md border-gray-300"
              autoComplete="off"
              required
            />
          </div>

          <div>
            <label htmlFor="issueCategory" className="block text-sm font-medium text-gray-600">
              {t("Categoria do Problema", "Issue Category")}
            </label>
            <select
              id="issueCategory"
              value={vehicle.category || ""}
              onChange={handleCategoryChange}
              className="input w-full py-2 px-3 rounded-md border-gray-300"
            >
              <option value="">{t("Selecione uma categoria", "Select a category")}</option>
              {issuesCategories.map((cat, i) => (
                <option key={i} value={cat.title}>{cat.title}</option>
              ))}
            </select>
          </div>
        </div>

        {vehicle.category && (
          <div>
            <label htmlFor="specificIssue" className="block text-sm font-medium text-gray-600">
              {t("Problema Específico", "Specific Issue")}
            </label>
            <select
              id="specificIssue"
              value={vehicle.issue || ""}
              onChange={handleInputChange}
              className="input w-full py-2 px-3 rounded-md border-gray-300"
            >
              <option value="">{t("Selecione um problema", "Select an issue")}</option>
              {filteredIssues.map((issue, i) => <option key={i} value={issue}>{issue}</option>)}
            </select>
          </div>
        )}  
      </div> 
      <div className="flex justify-between mt-6">
          <button
            type="button"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            disabled={loading}
            onClick={()=>{handlePrev()}}
          >
            {language === "pt" ? "Voltar" : "Back"}
          </button>
          <button
              type="button"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
              disabled={loading}
              onClick={()=>{handleNext()}}
            >
              {t("Proximo", "Next")}
            </button>
        </div>

    </div>
  );
};

export default VehicleInformation;

