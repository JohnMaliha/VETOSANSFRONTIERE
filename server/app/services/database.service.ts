import { injectable } from "inversify";
import * as pg from "pg";
import "reflect-metadata";
import { Room } from "../../../common/tables/Room";
import { Hotel } from "../../../common/tables/Hotel";
import { Gender, Guest } from "../../../common/tables/Guest";

import { Animal } from "../../../common/tables/Animal";

@injectable()
export class DatabaseService {

  // TODO: A MODIFIER POUR VOTRE BD
  public connectionConfig: pg.ConnectionConfig = {
    user: "postgres",
    database: "tp3_VetoSansFrontieres_db",
    password: "admin",
    port: 5432,
    host: "127.0.0.1",
    keepAlive: true
  };

  public pool: pg.Pool = new pg.Pool(this.connectionConfig);

  // ======= DEBUG =======
  public async getAllFromTable(tableName: string): Promise<pg.QueryResult> {
    
    const client = await this.pool.connect();
    const res = await client.query(`SELECT * FROM TP3VetoSansFrontieresDB.${tableName};`);
    client.release();
    return res;
  }

  // get animal
  public async filterAnimals(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    let queryText = "SELECT * FROM TP3VetoSansFrontieresDB.Animal;";
    const res = await client.query(queryText);
    client.release();
  //  console.log("animal",res);
    return res;
  }
  
  public async createAnimal(animal: Animal): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const queryText: string = `INSERT INTO TP3VetoSansFrontieresDB.Animal VALUES('${animal.noanimal}',
    '${animal.noclinique}',
    '${animal.noproprietaire}',
    '${animal.nom}','${animal.typeanimal}','${animal.espece}',
    '${animal.taille}','${animal.poids}','${animal.description}',
    '${animal.dateinscription}','${animal.etatactuel}');`;

    const res = await client.query(queryText);
    client.release();
    console.log(res);
    return res;
  }

  public async updateAnimal(animal: Animal): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    const query = `UPDATE TP3VetoSansFrontieresDB.Animal SET 
    noclinique ='${animal.noclinique}',
    noproprietaire =${animal.noproprietaire},
    nom='${animal.nom}',typeanimal ='${animal.typeanimal}',espece ='${animal.espece}',
    taille = '${animal.taille}', poids = '${animal.poids}', description = '${animal.description}',
    dateinscription ='${animal.dateinscription}',etatactuel ='${animal.etatactuel}' WHERE noanimal = ${animal.noanimal};`;

    const res = await client.query(query);
    client.release();
    return res;
  }

  public async deleteAnimal(noAnimal: number): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query(`DELETE FROM TP3VetoSansFrontieresDB.Animal WHERE noanimal = ${noAnimal};`);
    client.release();
    return res;
  }


  // facture
    public async filterFacture(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    let queryText = "SELECT * FROM TP3VetoSansFrontieresDB.Facture;";
    const res = await client.query(queryText);
    client.release();
  //  console.log("facture",res);
    return res;
  }





  // TO DELETE AFTER
  // ======= HOTEL =======
  public async createHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!hotel.hotelnb || !hotel.name || !hotel.city)
      throw new Error("Invalid create hotel values");

    const values: string[] = [hotel.hotelnb, hotel.name, hotel.city];
    const queryText: string = `INSERT INTO HOTELDB.Hotel VALUES($1, $2, $3);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


 // get the hotel names and numbers so so that the user can only select an existing hotel
  public async getHotelNamesByNos(): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const res = await client.query("SELECT hotelNb, name FROM HOTELDB.Hotel;");
    client.release()
    return res;
  }


  // modify name or city of a hotel
  public async updateHotel(hotel: Hotel): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
  
    if (hotel.name.length > 0) toUpdateValues.push(`name = '${hotel.name}'`);
    if (hotel.city.length > 0) toUpdateValues.push(`city = '${hotel.city}'`);

    if (!hotel.hotelnb || hotel.hotelnb.length === 0 || toUpdateValues.length === 0)
      throw new Error("Invalid hotel update query");

    const query = `UPDATE HOTELDB.Hotel SET ${toUpdateValues.join(", ")} WHERE hotelNb = '${hotel.hotelnb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  public async deleteHotel(hotelNb: string): Promise<pg.QueryResult> {
    // TO-DO
    const client = await this.pool.connect();
    const response = await client.query('SELECT * HOTELDB.${tableName};');
    client.release()
    return response;
  }


  // ======= ROOMS =======
  public async createRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!room.roomnb || !room.hotelnb || !room.type || !room.price)
      throw new Error("Invalid create room values");

    const values: string[] = [
      room.roomnb,
      room.hotelnb,
      room.type,
      room.price.toString(),
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1, $2, $3, $4);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


  public async filterRooms(
    hotelNb: string,
    roomNb: string = "",
    roomType: string = "",
    price: number = -1
    ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    if (!hotelNb || hotelNb.length === 0) throw new Error("Invalid filterRooms request");
    
    let searchTerms = [];
    searchTerms.push(`hotelNb = '${hotelNb}'`);

    if (roomNb.length > 0) searchTerms.push(`hotelNb = '${hotelNb}'`);
    if (roomType.length > 0) searchTerms.push(`type = '${roomType}'`);
    if (price >= 0) searchTerms.push(`price = ${price}`);

    let queryText = `SELECT * FROM HOTELDB.Room WHERE ${searchTerms.join(" AND ")};`;
    const res = await client.query(queryText);
    client.release()
    return res;
  }


  public async updateRoom(room: Room): Promise<pg.QueryResult> {
    const client = await this.pool.connect();

    let toUpdateValues = [];
    if (room.price >= 0) toUpdateValues.push(`price = ${room.price}`);
    if (room.type.length > 0)
      toUpdateValues.push(`type = '${room.type}'`);

    if (!room.hotelnb ||
      room.hotelnb.length === 0 ||
      !room.roomnb ||
      room.roomnb.length === 0 ||
      toUpdateValues.length === 0
    ) throw new Error("Invalid room update query");

    const query = `UPDATE HOTELDB.Room SET ${toUpdateValues.join(
    ", "
    )} WHERE hotelNb = '${room.hotelnb}' AND roomNb = '${room.roomnb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  public async deleteRoom(hotelNb: string, roomNb: string): Promise<pg.QueryResult> {
    if (hotelNb.length === 0) throw new Error("Invalid room delete query");
    const client = await this.pool.connect();

    const query = `DELETE FROM HOTELDB.Room WHERE hotelNb = '${hotelNb}' AND roomNb = '${roomNb}';`;
    const res = await client.query(query);
    client.release()
    return res;
  }


  // ======= GUEST =======
  public async createGuest(guest: Guest): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    if (
      !guest.guestnb ||
      !guest.nas ||
      !guest.name ||
      !guest.gender ||
      !guest.city
    ) throw new Error("Invalid create room values");

    if (!(guest.gender in Gender)) throw new Error("Unknown guest gender passed");

    const values: string[] = [
      guest.guestnb,
      guest.nas,
      guest.name,
      guest.gender,
      guest.city,
    ];
    const queryText: string = `INSERT INTO HOTELDB.Guest VALUES($1, $2, $3, $4, $5);`;
    const res = await client.query(queryText, values);
    client.release()
    return res;
  }


  public async getGuests(hotelNb: string, roomNb: string): Promise<pg.QueryResult> {
    if (!hotelNb || hotelNb.length === 0) throw new Error("Invalid guest hotel no");
    
    const client = await this.pool.connect();
    const queryExtension = roomNb ? ` AND b.roomNb = '${roomNb}'` : "";
    const query: string = `SELECT * FROM HOTELDB.Guest g JOIN HOTELDB.Booking b ON b.guestNb = g.guestNb WHERE b.hotelNb = '${hotelNb}'${queryExtension};`;

    const res = await client.query(query);
    client.release()
    return res;
  }

  // ======= BOOKING =======
  public async createBooking(
    hotelNb: string,
    guestNo: string,
    dateFrom: Date,
    dateTo: Date,
    roomNb: string
  ): Promise<pg.QueryResult> {
    const client = await this.pool.connect();
    const values: string[] = [
      hotelNb,
      guestNo,
      dateFrom.toString(),
      dateTo.toString(),
      roomNb,
    ];
    const queryText: string = `INSERT INTO HOTELDB.ROOM VALUES($1,$2,$3,$4,$5);`;

    const res = await client.query(queryText, values);
    client.release()
    return res;
  }
}
