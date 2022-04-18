const fs = require('fs');
const path = require('path');

const dealFile = (file) => {
	let data = fs.readFileSync(file, { encoding: 'utf-8' });
	data = data.replace('module.exports = function(sequelize, DataTypes) {', '\nmodule.exports = (sequelize) => {');
	data = data.replace(/DataTypes/g, 'Sequelize');
	// data = data.replace(
	// 	'    id: {\n      type: Sequelize.INTEGER(11),\n      allowNull: false,\n      primaryKey: true\n    }',
	// 	'    id: {\n      type: Sequelize.INTEGER(11),\n      allowNull: false,\n      primaryKey: true,\n      autoIncrement: true\n    }',
	// );
	// data = data.replace('\n  });', ',\n    timestamps: false,\n    });');
	// fs.writeFileSync('test.js', data);
	fs.writeFileSync(file, data);
};

const copy = (srcDir) => {
	fs.readdirSync(srcDir).forEach((file) => {
		dealFile(path.join(srcDir, file));
	});
};

// dealFile('./content.js');
copy(path.resolve(__dirname, 'models'));
