import { Component } from '@angular/core';
import { 
  IonicPage, 
  NavParams, 
  NavController, 
  ViewController, 
  ModalController,
  ToastController
} from 'ionic-angular';

import { ProvidersProductosProvider } from '../../providers/providers-productos/providers-productos';
import { ProvidersClientesProvider } from '../../providers/providers-clientes/providers-clientes';
import { CarritoPage } from '../../pages/carrito/carrito';

/**
 * Generated class for the ModalSite page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'modal-site',
  templateUrl: 'site.html',
})
export class ModalSite {
  public cliente:string;
  public pet: string = "menu";
  public productos: any = [];
  public comentarios: any = [];
  public comentario:string;
  public numProductos:number;


  constructor(
    private navParams: NavParams, 
    private view: ViewController,
    private modal: ModalController,
    private NavCtrl: NavController,
    private Productos: ProvidersProductosProvider,
    private Clientes: ProvidersClientesProvider,
    private Toast: ToastController) {

    this.numProductos = 0;

  }

  ionViewWillLoad() {
    this.cliente = this.navParams.get('cliente');
    console.log(this.cliente);
    this.getNumProductos();
    this.getProductos(this.cliente);
    this.getComentarios(this.cliente);
  }

  getNumProductos(){
    let carrito = JSON.parse(localStorage.getItem('carritoPideYa'));
    if(carrito) this.numProductos = carrito.length;
  }

  getProductos(cliente){
    let id = cliente._id;
    this.Productos.getProductos(id).then(res=>{
      console.log(res);
      this.productos = res;
    }).catch(err=>{console.log(err)})
  }

  getComentarios(cliente){
    let id = cliente._id;
    this.Clientes.getComentarios(id).then(res=>{
      console.log(res);
      this.comentarios = res;
    }).catch(err=> console.log(err))
  }

  addProducto(producto){
    
    let carrito = JSON.parse(localStorage.getItem('carritoPideYa'));
    if(carrito){
      carrito.push(producto);
      localStorage.setItem('carritoPideYa', JSON.stringify(carrito));  
    }else{
      localStorage.setItem('carritoPideYa', JSON.stringify([producto]));  
    }
    this.toast('Se agregó el producto a su pedido');
    console.log(carrito);
  }


  toast(message){
    let toast = this.Toast.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  returnID(cliente){
    return cliente._id
  }

  addComment(){
    console.log(this.comentario);
    let fecha:Date = new Date();
    let idProveedor = this.returnID(this.cliente);

    let comentario = {
      comentario: this.comentario,
      usuario: 'Anonimo',
      hora: `${fecha.getDate()}/${fecha.getMonth()+1} - ${fecha.getHours()}:${fecha.getMinutes()}`,
      proveedor: idProveedor
    };
    console.log(comentario);
    this.Clientes.addComentario(comentario).then(res=>{
      console.log(res);
      this.getComentarios(this.cliente);
      this.comentario = '';
    }).catch(err=> console.log(err))
  }

  closeModal(){
  	this.view.dismiss();
  }

  openPageCarrito(){
    // this.closeModal();
    this.NavCtrl.push(CarritoPage);
  }

}
