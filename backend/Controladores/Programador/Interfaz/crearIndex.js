
const util = require('../../../Servicios/utils.js');
const programadorServicios = require("../ProgramadorServicios.js");

module.exports = (ruta,nombre,datos,id,nombreReducers,nombreArch,nombreCarpeta)=>{

   console.log(ruta)
   try{
      
      var reglas = [];
      var tituloTabla = [];
      var camposTabla = [];
      var camposValues = [];
      var camposValuesEdit = [];
      var camposForm = [];
      var datosEnviar = [];
      for (var i = 0; i < datos.campos.length; i++) {
         var regla = [];
         var atributos = datos.campos[i].atributos

         var sig = ''
         

         if (i==0) {
            var nombreRef = `${datos.campos[i].value}Ref`
            var ref = `refs={${nombreRef}}`
         }
         if (datos.campos[i+1]) {
            var siguiente = datos.campos[i+1].value
            if (siguiente) {
               sig = `sig="${siguiente}"`;
            }
         }
         var type = ''
         if (datos.campos[i].tipoDato=='integer') {
            type =  `type="number"`
         }
        
         if (datos.campos[i].tipoCampo=='CampoInput') {
            var campoForm =`
                     <Col  xs={12} sm={6} md={4} >
                        <Field 
                           label="${datos.campos[i].label}"
                           name="${datos.campos[i].value}" 
                           component={CampoInput} 
                           placeholder="${datos.campos[i].placeholder || datos.campos[i].label}"
                           ${sig}
                           ${ref}

                        />
                     </Col>`
         }else if (datos.campos[i].tipoCampo=='CampoSelect') {
            var campoForm =`
                     <Col  xs={12} sm={6} md={4} >
                        <Field 
                           label="${datos.campos[i].label}"
                           name="${datos.campos[i].value}" 
                           component={CampoSelect}
                           ${ref}
                        >
                           <option value="">Seleccione...</option>
                           <option value="ACTIVO">ACTIVO</option>
                           <option value="INACTIVO">INACTIVO</option>
                        </Field>
                     </Col>`
         }else if (datos.campos[i].tipoCampo=='CampoSelectMultiple') {
            var campoForm =`
                     <Col  xs={12} sm={6} md={4} >
                        <Field 
                           label="${datos.campos[i].label}"
                           name="${datos.campos[i].value}" 
                           component={CampoSelect}
                           multiple
                           ${ref}
                        >
                           <option value="">Seleccione...</option>
                           <option value="ACTIVO">ACTIVO</option>
                           <option value="INACTIVO">INACTIVO</option>
                        </Field>
                     </Col>`
         }else if (datos.campos[i].tipoCampo=='CampoTextarea') {
            var campoForm =`
                     <Col md={12}>
                        <Field 
                           label="${datos.campos[i].label}"
                           name="${datos.campos[i].value}" 
                           component={CampoTextarea} 
                           placeholder="${datos.campos[i].placeholder || datos.campos[i].label}"
                           ${ref}
                        />
                     </Col>`
         }else{
            throw util.crearError ('II001',e);
         }

         camposForm.push(campoForm);
         datosEnviar.push(`${datos.campos[i].value}:values.${datos.campos[i].value}`)
         tituloTabla.push(`<th scope="col">${datos.campos[i].label}</th>`)
         camposTabla.push(`<td>{item.${datos.campos[i].value}}</td>`)
         camposValuesEdit.push(`${datos.campos[i].value}:item.${datos.campos[i].value}`)
         if (atributos.hasOwnProperty('tipo')) {
            if (atributos.tipo=='char' || atributos.tipo=='character' || atributos.tipo=='character varying' || atributos.tipo=='text') {
               regla.push(`string()`)
               if (atributos.hasOwnProperty('email')) {
                  regla.push(`email()`)
               }
               camposValues.push(`${datos.campos[i].value}:''`)
               
            }else if (atributos.tipo=='integer' || atributos.tipo=='numeric'){
               regla.push(`number()`)
               camposValues.push(`${datos.campos[i].value}:''`)
            }else if (atributos.tipo=='date'){
               regla.push(`date()`)
               camposValues.push(`${datos.campos[i].value}:''`)
            }else if (atributos.tipo=='boolean'){
               regla.push(`boolean()`)
               camposValues.push(`${datos.campos[i].value}:false`)
               continue;
            }else{
               camposValues.push(`${datos.campos[i].value}:''`)
               continue
            }
            if (atributos.hasOwnProperty('requerido')) {
               regla.push(`required()`)
            }
            if (atributos.hasOwnProperty('min')) {
               regla.push(`min(${atributos['min']})`)
            }

            if (atributos.hasOwnProperty('max')) {
               regla.push(`max(${atributos['max']})`)
            }
            console.log(regla)
            reglas.push(`${datos.campos[i].value}: Yup.${regla.join('.')}`)
         }
      }


      var camposFiltrar = datos.campos.map(item=>{
         return "l."+item.value+".toLowerCase().indexOf(action.value.toLowerCase())>-1"
      }).join(" || ")


      var texto = `
import React,{useState,useEffect,useReducer,useRef} from "react";

import {Button,Col,Container,Form,InputGroup,Modal,Row,Spinner,Table} from 'react-bootstrap';

import { Formik,Field} from 'formik';

import * as Yup from 'yup';

import ${nombreReducers} from './reducers';

import {eliminar${nombre},registrar${nombre},traer${nombre}} from './actions';

import {CampoInput,CampoSelect,CampoTextarea} from '../campos/index'

   var reglas = {
      ${reglas.join(',\n')}
   }

   var schemaDefaul = Yup.object(reglas);

   const initialState = {
      data:[],
      datos:[],
      buscando:false,
      error:'',
      eliminando:false,
      errorEliminar:''
   }

const ${nombreArch} = () => {
   const [state, dispatch] = useReducer(${nombreReducers}, initialState);
   const [mostrarModal, setmostrarModal] = useState(false);
   const [tituloModal, setTituloModal] = useState('');
   const [campos, setCampos] = useState([]);
   const [schema, setSchema] = useState(schemaDefaul);
   const [search, setSearch] = useState('');
   const [id, setId] = useState('');
   const [nombreButton, setNombreButton] = useState('');
   const [datos, setDatos] = useState({
                     ${camposValues.join(",\n")}
                  });

   const ${nombreRef} = useRef();

   useEffect(() => {
      traer${nombre}(dispatch,'api/${datos.nombre_recurso}','GET');
   }, []);

   return (
      <Container>
         <Row >
            <Col md="12" className="justify-content-md-center mt-3">
               <h3 className="text-center">Lista de ${nombre.toLowerCase()}</h3>
            </Col>

            <Col md="4">
            <Form.Group as={Col} >
               <InputGroup>
                  <Form.Control
                     type="search"
                     placeholder="Burcar ${nombreArch}"
                     aria-describedby="inputGroupPrepend"
                     value={search}
                     onChange={(e)=>{
                        var value = e.target.value
                        setSearch(value);
                        dispatch({type:"filtrar",value});
                     }}

                     style={{border:'1px solid #28a745'}}
                  />
                  <InputGroup.Prepend>
                     <Button variant="success"><i className="fa fa-search"></i></Button>
                  </InputGroup.Prepend>
               </InputGroup>
            </Form.Group>
            </Col>
            <Col md="4">
               <Button variant="outline-success" onClick={ () => {
                  setmostrarModal(true);
                  setTituloModal("Registro de ${nombre}");
                  setNombreButton("Crear ${nombre}");
               }} >Crear Nuevo</Button>
            </Col>
            {
               state.buscando?<Container className="m-4">
                  <Row className="justify-content-center m-4">
                     <Spinner animation="border" variant="success" />
                  </Row>
               </Container>
               :
               <Table responsive>
                  <thead>
                     <tr>
                        <th scope="col">#</th>
                        ${tituloTabla.join("\n")}
                        
                        <th scope="col" className="text-center">acciones</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        state.datos.map((item,index)=>{
                           return (
                              <tr key={index}>
                                 <td>{index + 1}</td>
                                 ${camposTabla.join("\n")}
                                 <td className="text-center">  
                                 {
                                    state.eliminando && id===item.${id}?null:<i className="fa fa-edit fa-lg" style={{'color':'#22954A', margin:5}}
                                       onClick={()=>{
                                          setId(item.${id})
                                          setDatos({
                                             ${camposValuesEdit}
                                          })
                                          setmostrarModal(true)
                                          setTituloModal("Editar ${nombre}");
                                          setNombreButton("Editar ${nombre}");
                                       }}
                                    ></i>
                                 }
                                 {
                                    state.eliminando && id===item.${id}?<Spinner animation="border" variant="success" />
                                    :<i className="fa fa-trash fa-lg" style={{'color':'red', margin:5}}
                                       onClick={()=>{
                                          setId(item.${id})
                                          eliminar${nombre}(dispatch,"api/persona/eliminar",'DELETE',{${id}:item.${id}});
                                       }}
                                    ></i>
                                 }
                                 </td>
                              </tr>
                           )
                        })
                     }
                  </tbody>
               </Table>
               }
               {
                  state.data.length===0 && !state.buscando && <Container className="m-4">
                     <Row className="justify-content-center">
                        <h5 >No hay campos agregados</h5>
                     </Row>
                  </Container>
               }
         </Row>
         <Modal
            size="xl"
            show={mostrarModal}
            onHide={() => setmostrarModal(false)}
            onExited={a=>{
               setId("")
               setDatos({
                  ${camposValues.join(",\n")}
               })}
            }
            onEntering={() => ${nombreRef}.current.focus()}
            aria-labelledby="example-modal-sizes-title-lg"
         >
            <Modal.Header closeButton>
               <Modal.Title id="example-modal-sizes-title-lg" style={{color:'#22954A'}}>
                  {tituloModal}
               </Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <Formik
                  validationSchema={schema}
                  initialValues={datos}
               >
               {({
                  handleSubmit,
                  handleChange,
                  handleBlur,
                  values,
                  touched,
                  isValid,
                  errors,
                  setFieldValue,
                  setValues,
                  validateField,
                  validateForm,
                  setFieldTouched
               }) => (
               <Form noValidate>
                  <Form.Row>

                     ${camposForm.join("\n")}

                  </Form.Row>

            <Container className="m-4">
               <Row className="justify-content-center">
                                 
                 <Button onClick={async () => {
                     await validateForm().then(a=>{
                        if (Object.entries(a).length === 0) {
                           console.log(id)
                           var data = values
                           if (!id) {
                              var url = 'api/${nombreCarpeta}/crear'
                              var metodo = 'POST'
                           }else{
                              var url = 'api/${nombreCarpeta}/editar'
                              var metodo = 'PUT'
                              data.${id} = id
                           }
                           dispatch('registrando')
                           registrar${nombre}(url,metodo,data).then(resp=>{
                              dispatch(resp);
                              setmostrarModal(false);
                              traer${nombre}(dispatch,'api/${datos.nombre_recurso}','GET');
                           },error=>{
                              dispatch(error);
                           })
                        }
                     })
                  }}>{nombreButton}</Button>
               
               </Row>
            </Container>
        </Form>
      )}
    </Formik>
            </Modal.Body>
         </Modal>
      </Container>
)}
export default ${nombreArch};
      `
      return programadorServicios.crearArchivo(ruta,texto);

   }catch(e){
      throw util.crearError ('IA001',e);
   }
}