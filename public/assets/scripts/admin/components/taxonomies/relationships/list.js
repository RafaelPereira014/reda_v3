import React, { PureComponent, Fragment } from 'react';

//  Components
import TableView from '%/components/common/table'
import DropdownWrapper from '%/components/taxonomies/relationships/dropdownWrapper';

export default class RelsListComp extends PureComponent{
    constructor(props) {
        super(props);
        
        //
        //  Handlers
        //
    }



    render(){
        const {
            data,
            dropdownLists,
            totalPages,
            onPageChange,
            activePage,
            onDropdownChange,
            onFilterChange,
            addRow,
            deleteRow,
            editRow,
            editing,
            filters,
            clearFilters
        } = this.props;
        console.log(dropdownLists)
        if(Object.keys(dropdownLists).length==0)
            return null;
        
        let header = [
            //'Macroárea',
            'Ano',
            'Disciplina',     
            'Domínios/Temas',
            'Sudominio',
            'Conceitos'   
        ];

        console.log(dropdownLists.hashtags)

        return (
            <TableView
                data={data}
                header={header}
                responsive={true}
                tableClass="stripped"
                totalPages={totalPages}
                onPageChange={onPageChange}
                activePage={activePage}
                addRow={addRow}
                deleteRow={deleteRow}
                editRow={editRow}
                editing={editing}
                clearFilters={clearFilters}
                RenderRow={
                    (
                        {
                            idx,
                            el
                        }
                    ) => (
                        <Fragment>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.years}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={el.term_id_1 || ""}
                                    level={1}
                                    relIdx={idx}
                                    onChange={onDropdownChange}
                                    defaultOption="---"
                                    noedit={editing.indexOf(idx)<0}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.areas}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={el.term_id_2 || ""}
                                    level={2}
                                    relIdx={idx}
                                    onChange={onDropdownChange}
                                    defaultOption="---"
                                    noedit={editing.indexOf(idx)<0}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.domains}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={el.term_id_3 || ""}
                                    level={3}
                                    relIdx={idx}
                                    onChange={onDropdownChange}
                                    defaultOption="---"
                                    noedit={editing.indexOf(idx)<0}
                                    />
                            </td> 
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.subdominios}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={el.term_id_4 || ""}
                                    level={4}
                                    relIdx={idx}
                                    onChange={onDropdownChange}
                                    defaultOption="---"
                                    noedit={editing.indexOf(idx)<0}
                                    />
                            </td>     
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.hashtags}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={el.term_id_5 || ""}
                                    level={5}
                                    relIdx={idx}
                                    onChange={onDropdownChange}
                                    defaultOption="---"
                                    noedit={editing.indexOf(idx)<0}
                                    />
                            </td>            
                        </Fragment>
                    )
                }
                RenderFilters={
                    () => (
                        <Fragment>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.years}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={filters.years || ""}
                                    onChange={onFilterChange}
                                    defaultOption="---"
                                    meta={{
                                        type: 'years'
                                    }}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.areas}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={filters.areas || ""}
                                    onChange={onFilterChange}
                                    defaultOption="---"
                                    meta={{
                                        type: 'areas'
                                    }}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.domains}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={filters.domains || ""}
                                    onChange={onFilterChange}
                                    defaultOption="---"
                                    meta={{
                                        type: 'domains'
                                    }}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.subdominios}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={filters.subdominios || ""}
                                    onChange={onFilterChange}
                                    defaultOption="---"
                                    meta={{
                                        type: 'subdominios'
                                    }}
                                    />
                            </td>
                            <td>
                                <DropdownWrapper 
                                    list={dropdownLists.hashtags}
                                    listValue="id"
                                    listTitle="title"
                                    startValue={filters.hashtags || ""}
                                    onChange={onFilterChange}
                                    defaultOption="---"
                                    meta={{
                                        type: 'hashtags'
                                    }}
                                    />
                            </td>
                        </Fragment>
                    )
                }
            />
        );
    }
    
}