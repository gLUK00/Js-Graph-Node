function jsgraphnode( sId, oProperties ){
	
	this.sId = sId;
	this.oSize = { width: 100, height: 100 };
	this.oCSS = {};
	//this.oEle = document.getElementById( sId );
	//this.oCanvas = this.oEle.getContext( '2d' );
	this.oShapes = {};
	this.oElements = {};
	this.oOptions = { fill: 'green', stroke: 'blue', 'stroke-width': '1' /*lineWidth: 1, fillStyle: 'green'*/ };
	this.oRefStyle = [ 'fill', 'stroke', 'stroke-width' /*'fill', 'lineWidth', 'fillStyle'*/ ];

	for( var sStyle in this.oOptions ){
		if( !this.oRefStyle.includes( sStyle ) ){
			continue;
		}
		//this.oCanvas[ sStyle ] = this.oOptions[ sStyle ];
	}

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

	// ajout des options visuelles
	this._drawAddOption = function( sOption, oData ){



		return oData[ sOption ] == undefined ?
			'' :
			sOption + '="' + oData[ sOption ] + '"';
	};
	
	// dessine une forme
	this.drawShape = function( oShape, oPos ){
		var sHtml = '';

		// determine la nouvelle position
		var oNewPos = oPos;
		if( oShape.data != undefined && oShape.data.pos != undefined ){
			oNewPos.x += oShape.data.pos.x;
			oNewPos.y += oShape.data.pos.y;
		}

		// pour les styles par defaut
		var sStyle = '';
		for( var sOptStyle in this.oOptions ){
			if( !this.oRefStyle.includes( sOptStyle ) ){
				continue;
			}
			console.log( "eeeeeeee" );
			if( oShape.data != undefined && oShape.data[ sOptStyle ] != undefined ){
				//this.oCanvas[ sStyle ] = oShape.data[ sStyle ];
				sStyle += sOptStyle + '="' + oShape.data[ sOptStyle ] + '" ';
			}else{
				//this.oCanvas[ sStyle ] = this.oOptions[ sStyle ];
				sStyle += sOptStyle + '="' + this.oOptions[ sOptStyle ] + '" ';
				
			}
		}

console.log( "tttttttttttttttttt" );
		console.log( sStyle );
		
		// dessine la forme en fonction du type
		if( oShape.type == 'circle' ){

			sHtml = '<circle cx="' + oNewPos.x + '" cy="' + oNewPos.y + '" r="' + oShape.data.radius + '" ' + sStyle + ' />';

		}else if( oShape.type == 'rectangle' ){

			sHtml = '<rect width="' + oShape.data.width + '" height="' + oShape.data.height + '" x="' + oNewPos.x + '" y="' + oNewPos.y + '" ' + sStyle + ' />';

		}else if( oShape.type == 'ellipse' ){

			sHtml = '<ellipse cx="' + oNewPos.x + '" cy="' + oNewPos.y + '" rx="' + oShape.data.width + '" ry="' + oShape.data.height + '" ' + sStyle + ' />';

		}else if( oShape.type == 'line' ){

			sHtml = '<line x1="' + oNewPos.x + '" y1="' + oNewPos.y + '" x2="' + ( oNewPos.x + oShape.data.width ) + '" y2="' + ( oNewPos.y + oShape.data.height ) + '" ' + sStyle + ' />';

		}


		console.log( oShape.type );
		console.log( sHtml );
		
		// pour les sous forme
		if( oShape.shapes != undefined ){
			for( var i=0; i<oShape.shapes.length; i++ ){
				sHtml += this.drawShape( oShape.shapes[ i ], oPos );
			}
		}

		return sHtml;
	};
	
	// dessine un element
	this.drawElement = function( oElement ){
		
		return this.drawShape( oElement.shape, oElement.pos );
		
		
		//oElement.data.shapes
		
		//console.log( oElement.data.id );
		//console.log( oElement );
		
	};
	
	// dessine le schema
	this.drawSchema = function(){
		
		
		// determine le nouveau SVG
		var sHtml = '';
		//this.oCanvas.clearRect( 0, 0, this.oEle.width, this.oEle.height );
		
		// pour tous les elements
		for( var sId in this.oElements ){
			sHtml += this.drawElement( this.oElements[ sId ] );
		}

		console.log( 'fffffffffffffffff' );
		console.log( sHtml );

		// creation du style CSS
		var sCSS = '';
		if( Object.keys( this.oCSS ).length > 0 ){
			for( var sStyle in this.oCSS ){
				sCSS
			}
		}

		// mise a jour du SVG
		var oParentSvg = document.getElementById( this.sId );
		oParentSvg.innerHTML = '<svg id="jsgraphnode-' + this.sId + '" xmlns="http://www.w3.org/2000/svg" width="' + this.oSize.width + '" height="' + this.oSize.height + '" viewBox="0 0 ' + this.oSize.width + ' ' + this.oSize.height + '">' +
				sHtml +
			'</svg>';
		var oSvg = document.getElementById( 'jsgraphnode-' + this.sId );
		if( Object.keys( this.oCSS ).length > 0 ){
			for( var sStyle in this.oCSS ){
				oSvg.style[ sStyle ] = this.oCSS[ sStyle ];
			}
		}

	};
	
	// chargement des proprietes
	this.loadProperties = function( oProperties ){
		if( oProperties.css != undefined ){
			this.oCSS = oProperties.css;
		}
		if( oProperties.width != undefined ){
			this.oSize.width = oProperties.width;
		}
		if( oProperties.height != undefined ){
			this.oSize.height = oProperties.height;
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
