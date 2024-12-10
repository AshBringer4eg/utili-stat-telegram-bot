import { ACTIONS } from "../menu/schema";
import _ from 'lodash';
import fs from 'fs';
import configuration from "../../configuration";

export type MeasurementSession = { [key: string]: MeasurementSessionElement }

export type MeasurementSessionElement = {
  type: ACTIONS;
  active: boolean;
  fileUrl?: string,
  fileTgId?: string,
  fileGdId?: string,
  sheetRowNumber?: number,
  value?: number;
  date?: string,
  finalized?: boolean;
}

type SessionStorage = { [key: string]: SessionElement }

export class Session {
  private static instance: Session;
  private storage: SessionStorage = {};

  private constructor() {}


  public static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    // Return the existing instance
    return Session.instance;
  }

  public static async loadSessionFromFile(): Promise<void> {
    if (configuration.environment !== 'development') return;
    await fs.promises.writeFile('./session.json', '', { flag: 'a' });
    const sessionString = await fs.promises.readFile('./session.json', "utf8");
    const session = Session.getInstance();
    const loadedData = JSON.parse(sessionString || '{}');
    for (const id in loadedData) {
      session.storage[id] = new SessionElement(Number(id), loadedData[id].phoneNumber, loadedData[id].measurementSession);
    }
  }

  public static async saveSessionToFile(): Promise<void> {
    if (configuration.environment !== 'development') return;
    await fs.promises.writeFile('./session.json', JSON.stringify(Session.getInstance().storage || {}, null, 2));
  }

  // Example method for the singleton class
  public getSession(id: number): SessionElement {
    if (!this.storage[id]) this.storage[id] = new SessionElement(id);
    return this.storage[id];
  }
}

export class SessionElement {
  private id: number;
  private phoneNumber?: string;
  private measurementSession?: MeasurementSession;

  constructor(id: number, phoneNumber?: string, measurementSession?: MeasurementSession) {
    this.id = id;
    this.phoneNumber = phoneNumber;
    this.measurementSession = measurementSession;
  }

  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }

  public resetPhoneNumber(): void {
    this.phoneNumber = undefined;
  }

  public getPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }

  public getMeasurementSession(): MeasurementSession {
    if (!this.measurementSession || _.isEmpty(this.measurementSession)) {
      this.measurementSession = {};
      this.measurementSession[ACTIONS.HEAT_GJ] = { type: ACTIONS.HEAT_GJ, active: false };
      this.measurementSession[ACTIONS.HEAT_M3] = { type: ACTIONS.HEAT_M3, active: false };
      this.measurementSession[ACTIONS.HEAT_SD] = { type: ACTIONS.HEAT_SD, active: false };
      this.measurementSession[ACTIONS.ELECTRICITY] = { type: ACTIONS.ELECTRICITY, active: false };
      this.measurementSession[ACTIONS.COLD_WATER] = { type: ACTIONS.COLD_WATER, active: false };
      this.measurementSession[ACTIONS.HOT_WATER] = { type: ACTIONS.HOT_WATER, active: false };
    }
    return this.measurementSession;
  }

  public getMeasurementSessionElement(type: ACTIONS): MeasurementSessionElement | undefined {
    const measurementSession = this.getMeasurementSession();
    if (!measurementSession[type]) measurementSession[type] = { type, active: false };
    return measurementSession[type];
  }

  public resetMeasurementSession(): void {
    this.measurementSession = {};
    /* CLEAR FILES AND ROWS IN GOOGLE SERVICES */
  }

  public setActiveMeasurement(type: ACTIONS): MeasurementSessionElement {
    const measurementSession = this.getMeasurementSession();
    for (const key in measurementSession) {
      const measurement = measurementSession[key];
      measurement.active = false;
    }
    measurementSession[type].active = true;
    return measurementSession[type];
  }

  public getActiveMesurement(): MeasurementSessionElement | undefined {
    const measurementSession = this.getMeasurementSession();
    for (const key in measurementSession) {
      if (measurementSession[key].active) return measurementSession[key];
    }
    return undefined;
  }

  public finalizeActiveMeasurment(): void {
    const activeMeasurement = this.getActiveMesurement();
    if (activeMeasurement) {
      activeMeasurement.finalized = true;
      activeMeasurement.active = false;
    }
  }

  public hasEmptyMeasurements(): boolean {
    const measurementSession = this.getMeasurementSession();
    for (const key in measurementSession) {
      if (!measurementSession[key].finalized) return true;
    }
    return false;
  }
}