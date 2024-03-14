'use strict';
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import _, { set } from 'lodash';


// Utils
import { toggleClass, removeClass, isNode } from "#/utils";
import { setScrollClass } from "#/utils/filters";
import { parseQS } from "#/utils/history";
import * as relsUtils from "#/utils/termsRelationships";
import apiPath from "#/appConfig";

// Components
import Picky from "react-picky";

export default class AdvancedSearchRefactor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: [],
      open: false,
      selectedAnos: [],
      selectedDisciplinas: [],
      selectedDominiosTemas: [],
      selectedSubdominios: [],
      selectedConceitos: [],
      termsArray: [],
      dataSecondary: [],
    };

    this.resource__filter = React.createRef();
    this.filters_list = React.createRef();
    this.backdrop = React.createRef();

    this.handleMultiValueChangeAnos =
      this.handleMultiValueChangeAnos.bind(this);
    this.handleMultiValueChangeDisciplinas =
      this.handleMultiValueChangeDisciplinas.bind(this);

      this.toggleList = this.toggleList.bind(this);
      this.handleScroll = this.handleScroll.bind(this);


    }

  clearFilters = () => {
    this.setState({
      selectedAnos: [],
      selectedDisciplinas: [],
      selectedDominiosTemas: [],
      selectedSubdominios: [],
      selectedConceitos: [],
      termsArray: [],
      dataSecondary: [],
    });

    this.props.setFiltersResources({
      activePage: 1,
      filters: {
        terms: [],
      },
    });
  };

  componentDidMount() {
    this.fetch("taxonomies/tax");
  }


  toggleList() {
    let list = this.filters_list;
    let backdrop = this.backdrop;
    let body = document.getElementsByTagName('BODY')[0];
    toggleClass('open', list.current);
    toggleClass('open', backdrop.current);
    toggleClass('open', body);
    toggleClass('filter-menu', body);    
  }

  handleScroll() {
    if (
      this.resource__filter &&
      this.props.resources &&
      this.props.resources.length > 0
    ) {
      let el = this.resource__filter.current;
      let elTop = el.getBoundingClientRect().top;

      if (!this.topPos && elTop) {
        this.topPos =
          el.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop || 0);
      }

      if (this.topPos) {
        setScrollClass(el, 'filters--fixed', this.topPos);
      }
    }
  }

  async fetch(url) {
    this.setState({ loading: true });
    await fetch(apiPath.api + url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((result) => {
        this.setState({
          loading: false,
          data: result.result,
        });
      })

      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  handleMultiValueChangeAnos = (newMultiValue) => {
    this.setState({
      selectedAnos: newMultiValue,
    });

    const termsArrayAnos = newMultiValue.map((obj) => obj.id);

    const termsArrayDisciplinas = this.state.selectedDisciplinas.map(
      (obj) => obj.id
    );

    const termsArrayDominiosTemas = this.state.selectedDominiosTemas.map(
      (obj) => obj.id
    );

    const termsArraySubdominios = this.state.selectedSubdominios.map(
      (obj) => obj.id
    );

    const termsArrayConceitos = this.state.selectedConceitos.map(
      (obj) => obj.id
    );

    this.state.termsArray = termsArrayAnos.concat(
      termsArrayDisciplinas,
      termsArrayDominiosTemas,
      termsArraySubdominios,
      termsArrayConceitos
    );

    this.props.setFiltersResources({
      activePage: 1,
      filters: {
        terms: this.state.termsArray,
      },
    });
  };

  async handleMultiValueChangeDisciplinas(newMultiValue) {
    this.setState({
      selectedDisciplinas: newMultiValue,
    });

    const termsArrayDisciplinas = newMultiValue.map((obj) => parseInt(obj.id));

    const termsArrayAnos = this.state.selectedAnos.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDominiosTemas = this.state.selectedDominiosTemas.map(
      (obj) => parseInt(obj.id)
    );

    const termsArraySubdominios = this.state.selectedSubdominios.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayConceitos = this.state.selectedConceitos.map((obj) =>
      parseInt(obj.id)
    );

    this.state.termsArray = termsArrayDisciplinas.concat(
      termsArrayAnos,
      termsArrayDominiosTemas,
      termsArraySubdominios,
      termsArrayConceitos
    );

    this.props.setFiltersResources({
      ...this.props.filtersResources.data,
      activePage: 1,
      filters: {
        terms: this.state.termsArray,
      },
    });

    if (newMultiValue.length == 1) {
      this.setState({ loading: true });
      await fetch(
        apiPath.api +
          "relationships/listterms?limit=9999&levels=5&disciplinas[]=" +
          termsArrayDisciplinas[0],
        { method: "GET", headers: { "Content-Type": "application/json" } }
      )
        .then((response) => response.json())
        .then((result) => {
          this.setState({
            loading: false,
            dataSecondary: result.result,
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      const allTerms = termsArrayDominiosTemas.concat(
        termsArraySubdominios,
        termsArrayConceitos
      );

      const difference = this.state.termsArray.filter(
        (x) => !allTerms.includes(x)
      );

      this.setState({
        dataSecondary: [],
        selectedDominiosTemas: [],
        selectedSubdominios: [],
        selectedConceitos: [],
        termsArray: difference,
      });
    }
  }

  handleMultiValueChangeDominiosTemas = (newMultiValue) => {
    this.setState({
      selectedDominiosTemas: newMultiValue,
    });

    const termsArrayDominiosTemas = newMultiValue.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayAnos = this.state.selectedAnos.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDisciplinas = this.state.selectedDisciplinas.map((obj) =>
      parseInt(obj.id)
    );

    const termsArraySubdominios = this.state.selectedSubdominios.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayConceitos = this.state.selectedConceitos.map((obj) =>
      parseInt(obj.id)
    );

    this.state.termsArray = termsArrayDominiosTemas.concat(
      termsArrayAnos,
      termsArrayDisciplinas,
      termsArraySubdominios,
      termsArrayConceitos
    );

    this.props.setFiltersResources({
      activePage: 1,
      filters: {
        terms: this.state.termsArray,
      },
    });
  };

  handleMultiValueChangeSubdominios = (newMultiValue) => {
    this.setState({
      selectedSubdominios: newMultiValue,
    });

    const termsArraySubdominios = newMultiValue.map((obj) => parseInt(obj.id));

    const termsArrayAnos = this.state.selectedAnos.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDisciplinas = this.state.selectedDisciplinas.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDominiosTemas = this.state.selectedDominiosTemas.map(
      (obj) => parseInt(obj.id)
    );

    const termsArrayConceitos = this.state.selectedConceitos.map((obj) =>
      parseInt(obj.id)
    );

    this.state.termsArray = termsArraySubdominios.concat(
      termsArrayAnos,
      termsArrayDisciplinas,
      termsArrayDominiosTemas,
      termsArrayConceitos
    );

    this.props.setFiltersResources({
      activePage: 1,
      filters: {
        terms: this.state.termsArray,
      },
    });
  };

  handleMultiValueChangeConceitos = (newMultiValue) => {
    this.setState({
      selectedConceitos: newMultiValue,
    });

    const termsArrayConceitos = newMultiValue.map((obj) => parseInt(obj.id));

    const termsArrayAnos = this.state.selectedAnos.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDisciplinas = this.state.selectedDisciplinas.map((obj) =>
      parseInt(obj.id)
    );

    const termsArrayDominiosTemas = this.state.selectedDominiosTemas.map(
      (obj) => parseInt(obj.id)
    );

    const termsArraySubdominios = this.state.selectedSubdominios.map((obj) =>
      parseInt(obj.id)
    );

    this.state.termsArray = termsArrayConceitos.concat(
      termsArrayAnos,
      termsArrayDisciplinas,
      termsArrayDominiosTemas,
      termsArraySubdominios
    );

    this.props.setFiltersResources({
      activePage: 1,
      filters: {
        terms: this.state.termsArray,
      },
    });
  };

  renderTerms() {
    const { selectedAnos } = this.state;
    const { selectedDisciplinas } = this.state;
    const { selectedDominiosTemas } = this.state;
    const { selectedSubdominios } = this.state;
    const { selectedConceitos } = this.state;

    const anosFiltrados = this.state.data.filter(
      (obj) => obj.taxonomy_id === 5
    );
    const disciplinasFiltradas = this.state.data.filter(
      (obj) => obj.taxonomy_id === 7
    );
    // lowering case to sort, and sorting
    disciplinasFiltradas.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );

    let dominiosTemas = [];

    if (this.state.dataSecondary.rows) {
      dominiosTemas = this.state.dataSecondary.rows;
    } else {
      dominiosTemas = this.state.dataSecondary;
    }

    const newArrayDominiosTemas = [];
    const newArraySubdominios = [];
    const newArrayConceitos = [];

    // DOMINIOS TEMAS, EXTRACT
    dominiosTemas.forEach((obj) => {
      // Extract ID and title from each object
      const id = obj["term_id_3"];
      const title = obj["term_slug_order_3"];

      // Create a new object with only ID and title
      const newObj = {
        id: id,
        title: title,
      };

      // Add the new object to the newArray
      newArrayDominiosTemas.push(newObj);
    });

    // SUBDOMINIOS, EXTRACT
    dominiosTemas.forEach((obj) => {
      // Extract ID and title from each object
      const id = obj["term_id_4"];
      const title = obj["term_slug_order_4"];

      // Create a new object with only ID and title
      const newObj = {
        id: id,
        title: title,
      };

      // Add the new object to the newArray
      newArraySubdominios.push(newObj);
    });

    // CONCEITOS, EXTRACT
    dominiosTemas.forEach((obj) => {
      // Extract ID and title from each object
      const id = obj["term_id_5"];
      const title = obj["term_slug_order_5"];

      // Create a new object with only ID and title
      const newObj = {
        id: id,
        title: title,
      };

      // Add the new object to the newArray
      newArrayConceitos.push(newObj);
    });

    const uniqueArrayDominiosTemas = Array.from(
      new Set(newArrayDominiosTemas.map(JSON.stringify)),
      JSON.parse
    );
    const uniqueArraySubdominios = Array.from(
      new Set(newArraySubdominios.map(JSON.stringify)),
      JSON.parse
    );
    const uniqueArrayConceitos = Array.from(
      new Set(newArrayConceitos.map(JSON.stringify)),
      JSON.parse
    );

    return (
      <div
        className={"dropdown__wrapper"}
      >
        <div className={"dropdown__wrapper"}>
          <label>Anos</label>

          <Picky
            options={anosFiltrados}
            labelKey="title"
            valueKey="id"
            multiple={true}
            includeFilter
            includeSelectAll
            value={selectedAnos}
            dropdownHeight={400}
            placeholder={"Escolher filtro"}
            selectAllText={"Seleccionar todos"}
            manySelectedPlaceholder={"%s seleccionados"}
            allSelectedPlaceholder={"%s seleccionados"}
            onChange={this.handleMultiValueChangeAnos}
          />
        </div>

        <div className={"dropdown__wrapper"}>
          <label>Disciplinas</label>
          <Picky
            options={disciplinasFiltradas}
            labelKey="title"
            valueKey="id"
            multiple={true}
            includeFilter
            includeSelectAll
            value={selectedDisciplinas}
            dropdownHeight={400}
            placeholder={"Escolher filtro"}
            selectAllText={"Seleccionar todos"}
            manySelectedPlaceholder={"%s seleccionados"}
            allSelectedPlaceholder={"%s seleccionados"}
            onChange={this.handleMultiValueChangeDisciplinas}
          />
        </div>

        <div
          className={
            "dropdown__wrapper" +
            (uniqueArrayDominiosTemas.length == 0 ? " empty" : "")
          }
        >
          <label>Domínios/Temas</label>

          <Picky
            options={uniqueArrayDominiosTemas}
            labelKey="title"
            valueKey="id"
            multiple={true}
            includeFilter
            includeSelectAll
            value={selectedDominiosTemas}
            dropdownHeight={400}
            placeholder={"Escolher filtro"}
            selectAllText={"Seleccionar todos"}
            manySelectedPlaceholder={"%s seleccionados"}
            allSelectedPlaceholder={"%s seleccionados"}
            onChange={this.handleMultiValueChangeDominiosTemas}
          />
        </div>


          {/* SUBDOMINIOS */}

        <div
          className={
            "dropdown__wrapper" +
            (selectedDominiosTemas.length == 0 ? " empty" : "")
          }
        >
          <label>Subdomínios</label>

          <Picky
            options={uniqueArraySubdominios}
            labelKey="title"
            valueKey="id"
            multiple={true}
            includeFilter
            includeSelectAll
            value={selectedSubdominios}
            dropdownHeight={400}
            placeholder={"Escolher filtro"}
            selectAllText={"Seleccionar todos"}
            manySelectedPlaceholder={"%s seleccionados"}
            allSelectedPlaceholder={"%s seleccionados"}
            onChange={this.handleMultiValueChangeSubdominios}
          />
        </div>

        {/* CONCEITOS */}
       
       <div
          className={
            "dropdown__wrapper" +
            (selectedSubdominios.length == 0 ? " empty" : "")
          }
        >
          <label>Conceitos</label>

          <Picky
            options={uniqueArrayConceitos}
            labelKey="title"
            valueKey="id"
            multiple={true}
            includeFilter
            includeSelectAll
            value={selectedConceitos}
            dropdownHeight={400}
            placeholder={"Escolher filtro"}
            selectAllText={"Seleccionar todos"}
            manySelectedPlaceholder={"%s seleccionados"}
            allSelectedPlaceholder={"%s seleccionados"}
            onChange={this.handleMultiValueChangeConceitos}
          />
        </div>

        <div className="dropdown__wrapper" bis_skin_checked="1">
          <button
            style={{ marginTop: 32 }}
            className="cta primary"
            onClick={this.clearFilters}
          >
            {"Nova Pesquisa"}
          </button>
        </div>
      </div>
    );
  }

  render() {

   /* return (
      <div className={"resource__filter" + (this.props.open ? " opened" : "")}>


        <div className="row filters__list">

          <Fragment>
            <div className="col-xs-12 filters__list--elements">
              <div className="filters__list--wrapper">{this.renderTerms()}</div>
            </div>
          </Fragment>
        </div>
      </div>
    );*/


    const { taxonomies, open, className } = this.props;

      return (
        <div className={"resource__filter" + (open ? " opened" : "") + (className ? " "+className : "")} ref={this.resource__filter}>
          <div className={"backdrop"+ (open ? " open" : "")}  ref={this.backdrop} onClick={this.props.toggleFilters} />
          
          <div className={"row filters__list"+ (open ? " open" : "")} ref={this.filters_list}>
            {/* Close Button */}
            <div className="col-xs-2 filters__list--close">
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={this.props.toggleFilters}
              >
              
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
 
              <Fragment>
                <div className="col-xs-12 filters__list--elements">
                  <div className="filters__list--wrapper">
                  {this.renderTerms()}            
                    
                    
                  </div>              
                </div>
                <div className="col-xs-12 filters__list--submit">
                  <button className="cta primary" onClick={this.props.toggleFilters}>
                    Fechar
                  </button>
                </div>            
              </Fragment>
            
          </div>
        </div>
      );
  }
}
