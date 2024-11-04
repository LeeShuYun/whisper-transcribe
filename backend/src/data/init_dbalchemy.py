from sqlalchemy import Column, String, Integer, create_engine, MetaData, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.ddl import DDLElement
from sqlalchemy.ext.compiler import compiles
from src.entities.entity import Session, engine, Base, Transcribe, transcribe_fields

# Define the base class for declarative models
Base = declarative_base()

# Define the original table model
# class Transcription(Base):
#     __tablename__ = 'transcription'
#     created_on = Column(String, primary_key=True)
#     audio_file_name = Column(String)
#     transcription = Column(String)

# Define the CreateFtsTable class
class CreateFtsTable(DDLElement):
    def __init__(self, table, version=5):
        self.table = table
        self.version = version

# Define the compilation function for CreateFtsTable
@compiles(CreateFtsTable)
def compile_create_fts_table(element, compiler, **kw):
    tbl = element.table
    version = element.version
    preparer = compiler.preparer
    sql_compiler = compiler.sql_compiler

    tbl_name = preparer.format_table(tbl)
    vtbl_name = preparer.quote(tbl.name + "_idx")

    text = "\nCREATE VIRTUAL TABLE "
    text += vtbl_name + " "
    text += "USING fts" + str(version) + "("

    separator = "\n"

    pk_column, = tbl.primary_key
    columns = [col for col in tbl.columns if col is not pk_column]

    for column in columns:
        text += separator
        separator = ", \n"
        text += "\t" + preparer.format_column(column)

        if not isinstance(column.type, String):
            text += " UNINDEXED"

    text += separator
    text += "\tcontent=" + sql_compiler.render_literal_value(
            tbl.name, String())

    text += separator
    text += "\tcontent_rowid=" + sql_compiler.render_literal_value(
            pk_column.name, String())

    text += "\n)\n\n"
    return text

# Set up the database engine and session
engine = create_engine('sqlite:///:memory:')  # In-memory SQLite database
Base.metadata.create_all(engine)  # Create the original table

# Use the CreateFtsTable DDL command to create the FTS table
metadata = MetaData()
my_table = Table('transcription_idx', metadata, Column('created_on', String, primary_key=True),
Column('transcription', String),  Column('audio_file_name', String))
create_fts_ddl = CreateFtsTable(my_table)  # Instantiate with the table and FTS version


with engine.connect() as connection:
    connection.execute(create_fts_ddl)  # Execute the DDL to create the FTS table

# Verify by inspecting the table names in the database
# with engine.connect() as connection:
#     result = connection.execute("SELECT * FROM transcription_idx ")
#     print("Tables in the database:", [row[0] for row in result])
from sqlalchemy import select, text

query = select([Transcribe.created_on, Transcribe.audio_file_name, Transcribe.transcription]).where(text("query @@ to_tsvector('english', audio_file_name)")).order_by(text('rank DESC')).params(query=func.plainto_tsquery('sample'))

for row in session.execute(query):
    print(Transcribe.created_on)
