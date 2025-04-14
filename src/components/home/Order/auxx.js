<div>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        {t("Informações do Veículo", "Vehicle Information")}
      </h2>

      <div className="space-y-6">
        {/* Brand and Model */}
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

        {/* Plate and Issue Category */}
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

        {/* Specific Issue */}
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



      <div className="space-y-6">
        {/* Pickup and Destination */}
        <div className="w-full">
          <label htmlFor="pickup-input" className="block text-sm font-medium text-gray-700">
            {t("Local de Retirada", "Pickup Location")}
          </label>
          <input
            id="pickup-input"
            placeholder={t("Digite o local de retirada", "Enter pickup location")}
            className="input w-full py-2 px-3 rounded-md border-gray-300"
            style={{ height: "40px" }}
          />
        </div>

        <div className="w-full mt-4">
          <label htmlFor="destination-input" className="block text-sm font-medium text-gray-700">
            {t("Destino", "Destination")}
          </label>
          <input
            id="destination-input"
            placeholder={t("Digite o destino", "Enter destination")}
            className="input w-full py-2 px-3 rounded-md border-gray-300"
            style={{ height: "40px" }}
          />
        </div>

        {/* Suggestions List */}
        <div>
          <h3 className="text-sm font-medium text-gray-600">Suggestions</h3>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="cursor-pointer" onClick={() => {
                if (!selectedOrigin) {
                  handleSelectOrigin(suggestion);
                } else {
                  handleSelectDestination(suggestion);
                }
              }}>
                {suggestion.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Price Details */}
        {showPriceDetails && (
          <div className="text-center mt-4 text-lg font-semibold">
            <div>{t("Duração:", "Duration:")} {transport?.duracao}</div>
            <div>{t("Distância:", "Distance:")} {transport?.distancia}</div>
            <div>{t("Preço:", "Price:")} €{transport?.preco}</div>
          </div>
        )}

        {/* Action Buttons */}
        {!showPriceDetails ? (
          <button
            type="button"
            onClick={handleCalculatePrice}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700"
            disabled={loading}
          >
            {loading ? t("Calculando...", "Calculating...") : t("Calcular Preço", "Calculate Price")}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 mt-6"
            disabled={loading}
          >
            {t("Solicitar", "Book Now")}
          </button>
        )}
      </div>
    </div>
    </div>
