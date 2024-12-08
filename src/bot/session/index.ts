type FileUploadWaiting = {
    type?: string,
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

  // Example method for the singleton class
  public getSession(id: number): SessionElement {
    if (!this.storage[id]) this.storage[id] = new SessionElement(id);
    return this.storage[id];
  }
}

class SessionElement {
  private id: number;
  private fileUploadWaiting?: FileUploadWaiting;
  private phoneNumber?: string;

  constructor(id: number) {
    this.id = id;
  }

  public getFileUploadWaiting(): FileUploadWaiting | undefined {
    return this.fileUploadWaiting;
  }

  public setFileUploadWaiting(fileUploadWaiting: FileUploadWaiting): void {
    this.fileUploadWaiting = fileUploadWaiting;
  }

  public setFileUploadWaitingType(type: string): void {
    if (!this.fileUploadWaiting) this.fileUploadWaiting = {};
    this.fileUploadWaiting.type = type;
  }

  public getFileUploadWaitingType(): string | undefined {
    return this.fileUploadWaiting?.type;
  }

  public resetFileUploadWaiting(): void {
    this.fileUploadWaiting = undefined;
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
}