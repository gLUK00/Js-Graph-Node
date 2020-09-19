function jsgraphnode( sId, oProperties ){
	
	this.sId = sId;
	this.oEle = document.getElementById( sId );
	this.oCanvas = this.oEle.getContext( '2d' );
	this.oShapes = {};
	this.oElements = {};
	this.oOptions = { strokeStyle: 'black' };

	this.oCanvas.strokeStyle = this.oOptions.strokeStyle;

	// ajout d'une reference de forme
	this.addRefShape = function( sName, oShape ){
		this.oShapes[ sName ] = oShape;
	};
	
	// ajout d'un element sur le canvas
	this.addElement = function( sShapeName, oPos, oData ){
		var oShape = Object.assign( {}, this.oShapes[ sShapeName ] );
		
		// gestion de l'identifiant
		if( oData == undefined ){
			oData = {};
		}
		if( oData.id == undefined ){
			oData.id = Math.random().toString(36).substring(2) + Date.now().toString(36);
		}
		
		// ajout de l'element
		this.oElements[ oData.id ] = {shape: oShape, pos: oPos, data: oData };
	};
	
	// dessine une forme
	this.drawShape = function( oShape, oPos ){

		// determine la nouvelle position
		var oNewPos = oPos;
		if( oShape.data != undefined && oShape.data.pos != undefined ){
			oNewPos.x += oShape.data.pos.x;
			oNewPos.y += oShape.data.pos.y;
		}

		if( oShape.data != undefined && oShape.data.strokeStyle != undefined ){
			this.oCanvas.strokeStyle = oShape.data.strokeStyle;
		}else{
			this.oCanvas.strokeStyle = this.oOptions.strokeStyle;
		}


		
		// dessine la forme en fonction du type
		if( oShape.type == 'circle' ){
			this.oCanvas.beginPath();

			//this.oCanvas.strokeStyle = 'blue';

			this.oCanvas.arc( oNewPos.x, oNewPos.y, oShape.data.radius, 0, 2 * Math.PI);
			this.oCanvas.stroke();
		}else if( oShape.type == 'rectangle' ){
			this.oCanvas.beginPath();
			this.oCanvas.rect( oNewPos.x, oNewPos.y, oShape.data.width, oShape.data.height );
			this.oCanvas.stroke();

			//console.log( 'rrrrrrrrrrrrr' );
			//console.log( [ oNewPos.x, oNewPos.y, oShape.data.width, oShape.data.height ] );
		}
		console.log( oShape.type );
		
		// pour les sous forme
		if( oShape.shapes != undefined ){
			for( var i=0; i<oShape.shapes.length; i++ ){
				this.drawShape( oShape.shapes[ i ], oPos );
			}
		}
	};
	
	// dessine un element
	this.drawElement = function( oElement ){
		
		this.drawShape( oElement.shape, oElement.pos );
		
		
		//oElement.data.shapes
		
		//console.log( oElement.data.id );
		//console.log( oElement );
		
	};
	
	// dessine le canvas
	this.drawCanvas = function(){
		
		// efface les elements existants
		this.oCanvas.clearRect( 0, 0, this.oEle.width, this.oEle.height );
		
		// pour tous les elements
		for( var sId in this.oElements ){
			this.drawElement( this.oElements[ sId ] );
		}
	};
	
	// chargement des proprietes
	this.loadProperties = function( oProperties ){
		if( oProperties.css != undefined ){
			for( var k in oProperties.css ){
				this.oEle.style[ k ] = oProperties.css[ k ];
			}
		}
	};
	
	
	// chargement des proprietes
	if( oProperties != undefined ){
		this.loadProperties( oProperties );
		if( oProperties.options != undefined ){
			this.oOptions = Object.assign( this.oOptions, oProperties.options );
		}
	}
}