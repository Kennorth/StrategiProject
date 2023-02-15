from flask import Flask,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate,migrate
import os
from flask_cors import CORS
from sqlalchemy import update

app = Flask(__name__)
CORS(app)
app.debug=True

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'

db = SQLAlchemy(app)

migrate = Migrate(app,db)



##########################################################Database Models########################################

#Tabela para todos Herois selecionados como possiveis candidatos
class SelectedHero(db.Model):
    __tablename__ = 'selectedheroes'
    Id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True)
    description = db.Column(db.String(500), unique=False)
    image_url = db.Column(db.String(100),unique=False)
    team = db.Column(db.Integer,unique=False)

    def __repr__(self):
        return {"id": self.Id, "nome": self.name,"descricao": self.description, "imagem": self.image_url}

    @property
    def serialize(self):
        return {"id": self.Id, "nome": self.name, "descricao": self.description, "imagem": self.image_url}

#Tabela para todas Equipes criadas
class Team(db.Model):
    __tablename__ = 'teams'
    Id = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(20), unique=True)

    def __repr__(self):
        return {"id": self.Id, "equipe": self.Name}
    @property
    def heroes(self):
        equipe = self.Id
        herois = []
        teams = db.session.query(SelectedHero).filter_by(team = equipe).all()
        for hero in teams:
            heroi = {"name": hero.name, "descricao": hero.description, "imagem": hero.image_url}
            herois.append(heroi)
        return herois

    @property
    def serialize(self):
        return {"id": self.Id, "nome": self.Name, "herois": self.heroes}

##########################################################################################################################

#Creating default team Avengers
#vingadores = Team(Name = "Vingadores")
#db.session.add(vingadores)
#db.sessiion.commit()


########################################## EXTRA FUNCTIONS ###############################################################

#Função para verificar se o objeto informado foi criado, caso não cria o objeto novo
def get_or_create(session, model, **kwargs):
    objeto = session.query(model).filter_by(**kwargs).one_or_none()
    if objeto:
        return objeto,False
    objeto = model(**kwargs)
    session.add(objeto)
    session.commit()
    return objeto,True

###########################################################################################################################



########################################### API METHODS ############################################################################

#REQUESTS RELACIONADOS AS EQUIPES

#POST = Cria equipe GET = retorna equipe e herois que fazem parte
@app.route('/equipe', methods=["POST", "GET", "DELETE"])
def equipe():

    #POST
    if request.method == "POST":
        data = request.json
        nome = data.get('nome')
        equipe, created = get_or_create(db.session,Team, Name= nome.lower())
        return "Equipe Criada"

    #GET
    elif(request.method == "GET"):
        lista_equipes= []
        equipes = Team.query.all()
        for equipe in equipes:
            lista_equipes.append(equipe.serialize)
        return jsonify(lista_equipes)

    #DELETE
    elif(request.method == "DELETE"):
        data = request.json
        equipe = data.get('equipe')
        if equipe == 1:
            return "Não foi possivel remover essa equipe"
        team = Team.query.filter_by(Id = equipe).first()
        heroes = SelectedHero.query.filter_by(team = equipe).all()
        for hero in heroes:
            hero.team = 0
        db.session.delete(team)
        db.session.commit()
        return "Equipe deletada"


#REQUEST PARA BUSCAR UNICA EQUIPE POR ID
@app.route('/team', methods=["GET"])
def single_team():
    team = request.args.get('equipe')
    equipe = Team.query.filter_by(Name = team).first()
    return equipe.serialize

#REQUESTS RELACIONADOS A ADIÇÃO DE HEROIS A UMA EQUIPE
#Adicionar Heroi a equipe
@app.route('/add', methods=["POST","UPDATE"])
def add_to_team():
    data = request.json
    equipe = data.get("equipe")
    heroi = data.get("heroi")
    SelectedHero.query.filter_by(name=heroi).update({'team': equipe})
    db.session.commit()
    return "Heroi Alocado em equipe"

@app.route('/remove', methods=["POST"])
def remove_from_team():
    data = request.json
    nome = data.get("heroi")
    update(SelectedHero).where(SelectedHero.name == nome).values(team = 0)
    db.session.commit()
    return "Heroi removido da equipe"

#REQUESTS RELACIONADOS AOS HEROIS
#POST = Criar heroi selecionado na tabela GET= Retorna lista de herois selecionados
@app.route('/heroi', methods=["POST", "GET", "DELETE"])
def add_heroi():

    #POST
    if (request.method == "POST"):
        data = request.json
        nome = data.get('nome')
        descricao = data.get('descricao')
        imagem = data.get('imagem')
        time = 0
        heroi,created = get_or_create(db.session,SelectedHero,name= nome, description= descricao, image_url = imagem, team = time)
        return "Heroi criado"

    #GET
    elif (request.method == "GET"):
        lista_herois=[]
        herois = SelectedHero.query.all()
        for heroi in herois:
            lista_herois.append(heroi.serialize)
        return jsonify(lista_herois)

    #DELETE
    elif(request.method == "DELETE"):
        data = request.json
        nome = data.get('nome')
        deleted = SelectedHero.query.filter_by(name = nome).first()
        db.session.delete(deleted)
        db.session.commit()
        return "Heroi deletado com sucesso"


#REQUEST PARA BUSCAR HEROI POR NOME
@app.route('/search', methods=["GET"])
def search_hero():
    nome = request.args.get('nome')
    heroi = SelectedHero.query.filter_by(name = nome).one_or_none()
    if heroi:
        return heroi.serialize
    return False

#REQUEST PARA TODOS OS HEROIS QUE ESTÃO DISPONIVEIS
@app.route('/disponivel', methods=["GET"])
def disponivel():
    herois = SelectedHero.query.all()
    retorno = []
    for heroi in herois:
        if(heroi.team == 0):
            retorno.append(heroi.serialize)
    return jsonify(retorno)


#################################################################################################################################################

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=port)