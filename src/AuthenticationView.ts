// AuthenticationView.ts
import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { createCustomCanvas, CanvasConfig, ViewContentProvider } from "./CanvasUtils";
import { supabase } from "./main";
import { SignUpWithPasswordCredentials } from "@supabase/supabase-js";

export const AUTHENTICATION_VIEW_ID = "authentication-view-container";

interface FormFields {
  email: string;
  password: string;
  confirmPassword?: string;
}

interface InputField {
  id: string;
  value: string;
  isPassword: boolean;
  isFocused: boolean;
  maxLength?: number;
}

class AuthenticationContentProvider implements ViewContentProvider {
  private currentMode: "login" | "register" = "login";
  private formFields: FormFields = { email: "", password: "" };
  private inputFields: Map<string, InputField> = new Map();
  private focusedField: string | null = null;
  private cursorVisible: boolean = true;
  private cursorBlinkTimer: number = 0;
  private app: Application | null = null;
  private mainContainer: Container | null = null;

  async setupContent(app: Application): Promise<void> {
    this.app = app;
    const mainContainer = new Container();
    this.mainContainer = mainContainer;
    app.stage.addChild(mainContainer);

    this.createAuthenticationUI(app, mainContainer);

    // Setup keyboard listeners
    document.addEventListener("keydown", (e) => this.handleKeyDown(e));
    document.addEventListener("keyup", () => this.handleKeyUp());

    // Handle window resize
    window.addEventListener("resize", () => {
      this.createAuthenticationUI(app, mainContainer);
    });

    // Cursor blink animation
    app.ticker.add(() => {
      this.cursorBlinkTimer += 1;
      if (this.cursorBlinkTimer > 30) {
        this.cursorVisible = !this.cursorVisible;
        this.cursorBlinkTimer = 0;
        this.updateInputDisplay();
      }
    });
  }

  private createAuthenticationUI(app: Application, mainContainer: Container): void {
    mainContainer.removeChildren();

    const screenWidth = app.screen.width;
    const screenHeight = app.screen.height;

    // Create centered card container
    const cardContainer = new Container();
    cardContainer.position.set(screenWidth / 2, screenHeight / 2);
    mainContainer.addChild(cardContainer);

    // Card background
    const cardBg = new Graphics();
    cardBg.rect(-200, -300, 400, 600);
    cardBg.fill({ color: 0xffffff });
    cardBg.position.set(0, 0);
    cardContainer.addChild(cardBg);

    // Title
    const titleStyle = new TextStyle({
      fontSize: 24,
      fontWeight: "bold",
      fill: 0x1099bb,
      fontFamily: "Arial",
    });
    const titleText = new Text({
      text: this.currentMode === "login" ? "Login" : "Register",
      style: titleStyle,
    });
    titleText.anchor.set(0.5);
    titleText.position.set(0, -250);
    cardContainer.addChild(titleText);

    // Toggle buttons
    const loginBtnBg = new Graphics();
    loginBtnBg.rect(-95, -220, 90, 40);
    loginBtnBg.fill({ color: this.currentMode === "login" ? 0x1099bb : 0xcccccc });
    loginBtnBg.eventMode = "static";
    loginBtnBg.cursor = "pointer";
    cardContainer.addChild(loginBtnBg);

    const loginBtnText = new Text({
      text: "Login",
      style: new TextStyle({
        fontSize: 14,
        fill: this.currentMode === "login" ? 0xffffff : 0x333333,
        fontFamily: "Arial",
      }),
    });
    loginBtnText.anchor.set(0.5);
    loginBtnText.position.set(-50, -200);
    cardContainer.addChild(loginBtnText);

    loginBtnBg.on("pointerdown", () => {
      this.currentMode = "login";
      this.inputFields.clear();
      this.formFields = { email: "", password: "" };
      this.focusedField = null;
      this.createAuthenticationUI(app, mainContainer);
    });

    const registerBtnBg = new Graphics();
    registerBtnBg.rect(5, -220, 90, 40);
    registerBtnBg.fill({ color: this.currentMode === "register" ? 0x1099bb : 0xcccccc });
    registerBtnBg.eventMode = "static";
    registerBtnBg.cursor = "pointer";
    cardContainer.addChild(registerBtnBg);

    const registerBtnText = new Text({
      text: "Register",
      style: new TextStyle({
        fontSize: 14,
        fill: this.currentMode === "register" ? 0xffffff : 0x333333,
        fontFamily: "Arial",
      }),
    });
    registerBtnText.anchor.set(0.5);
    registerBtnText.position.set(50, -200);
    cardContainer.addChild(registerBtnText);

    registerBtnBg.on("pointerdown", () => {
      this.currentMode = "register";
      this.inputFields.clear();
      this.formFields = { email: "", password: "", confirmPassword: "" };
      this.focusedField = null;
      this.createAuthenticationUI(app, mainContainer);
    });

    // Form fields
    let yPosition = -140;

    // Email label
    const emailLabelText = new Text({
      text: "Email:",
      style: new TextStyle({ fontSize: 14, fill: 0x333333, fontFamily: "Arial", fontWeight: "bold" }),
    });
    emailLabelText.anchor.set(0, 0.5);
    emailLabelText.position.set(-180, yPosition);
    cardContainer.addChild(emailLabelText);

    yPosition += 40;

    // Email input field
    this.createInputField(cardContainer, "email", yPosition, false);
    yPosition += 50;

    // Password label
    const passwordLabelText = new Text({
      text: "Password:",
      style: new TextStyle({ fontSize: 14, fill: 0x333333, fontFamily: "Arial", fontWeight: "bold" }),
    });
    passwordLabelText.anchor.set(0, 0.5);
    passwordLabelText.position.set(-180, yPosition);
    cardContainer.addChild(passwordLabelText);

    yPosition += 40;

    // Password input field
    this.createInputField(cardContainer, "password", yPosition, true);
    yPosition += 50;

    // Confirm Password field (register only)
    if (this.currentMode === "register") {
      const confirmLabelText = new Text({
        text: "Confirm Password:",
        style: new TextStyle({ fontSize: 14, fill: 0x333333, fontFamily: "Arial", fontWeight: "bold" }),
      });
      confirmLabelText.anchor.set(0, 0.5);
      confirmLabelText.position.set(-180, yPosition);
      cardContainer.addChild(confirmLabelText);

      yPosition += 40;

      this.createInputField(cardContainer, "confirmPassword", yPosition, true);
      yPosition += 50;
    }

    // Submit button
    const submitBtnBg = new Graphics();
    submitBtnBg.rect(-180, yPosition, 360, 40);
    submitBtnBg.fill({ color: 0x1099bb });
    submitBtnBg.eventMode = "static";
    submitBtnBg.cursor = "pointer";
    cardContainer.addChild(submitBtnBg);

    const submitBtnText = new Text({
      text: this.currentMode === "login" ? "Login" : "Register",
      style: new TextStyle({
        fontSize: 16,
        fill: 0xffffff,
        fontFamily: "Arial",
        fontWeight: "bold",
      }),
    });
    submitBtnText.anchor.set(0.5);
    submitBtnText.position.set(0, yPosition + 20);
    cardContainer.addChild(submitBtnText);

    submitBtnBg.on("pointerdown", () => {
      if (this.currentMode === "login") {
        this.handleLoginSubmit(this.formFields);
      } else {
        this.handleRegisterSubmit(this.formFields);
      }
    });
  }

  private createInputField(
    container: Container,
    fieldId: string,
    yPosition: number,
    isPassword: boolean
  ): void {
    // Initialize input field if not exists
    if (!this.inputFields.has(fieldId)) {
      this.inputFields.set(fieldId, {
        id: fieldId,
        value: this.formFields[fieldId as keyof FormFields] || "",
        isPassword: isPassword,
        isFocused: false,
        maxLength: 100,
      });
    }

    // Input background
    const inputBg = new Graphics();
    inputBg.rect(-180, yPosition, 360, 35);
    inputBg.fill({ color: 0xf5f5f5 });
    inputBg.stroke({ color: 0xdddddd, width: 1 });
    container.addChild(inputBg);

    inputBg.eventMode = "static";
    inputBg.on("pointerdown", () => {
      this.focusedField = fieldId;
      this.updateInputDisplay();
    });

    // Input text display
    const inputField = this.inputFields.get(fieldId)!;
    const displayText = isPassword
      ? "•".repeat(inputField.value.length)
      : inputField.value || "";
    const placeholder = isPassword ? "Enter your password" : "Enter your email";

    const inputText = new Text({
      text: displayText || placeholder,
      style: new TextStyle({
        fontSize: 14,
        fill: displayText ? 0x000000 : 0x999999,
        fontFamily: "monospace",
      }),
    });
    inputText.anchor.set(0, 0.5);
    inputText.position.set(-170, yPosition + 17.5);
    inputText.name = `text_${fieldId}`;
    container.addChild(inputText);

    // Cursor (blinking line)
    const cursor = new Graphics();
    cursor.rect(0, -8, 1, 16);
    cursor.fill({ color: 0x000000 });
    cursor.position.set(-170 + this.getTextWidth(displayText), yPosition + 17.5);
    cursor.name = `cursor_${fieldId}`;
    cursor.visible = this.focusedField === fieldId && this.cursorVisible;
    container.addChild(cursor);
  }

  private getTextWidth(text: string): number {
    // Approximate character width for monospace font at size 14
    return text.length * 8;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.focusedField || !this.inputFields.has(this.focusedField)) return;

    const field = this.inputFields.get(this.focusedField)!;

    if (event.key === "Backspace") {
      event.preventDefault();
      field.value = field.value.slice(0, -1);
      this.formFields[this.focusedField as keyof FormFields] = field.value;
      this.updateInputDisplay();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      if (field.value.length < (field.maxLength || 100)) {
        field.value += event.key;
        this.formFields[this.focusedField as keyof FormFields] = field.value;
        this.updateInputDisplay();
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      this.focusNextField();
    }
  }

  private handleKeyUp(): void {
    this.cursorVisible = true;
    this.cursorBlinkTimer = 0;
  }

  private focusNextField(): void {
    const fields = this.currentMode === "login" ? ["email", "password"] : ["email", "password", "confirmPassword"];
    const currentIndex = fields.indexOf(this.focusedField || "");
    const nextIndex = (currentIndex + 1) % fields.length;
    this.focusedField = fields[nextIndex];
    this.updateInputDisplay();
  }

  private updateInputDisplay(): void {
    if (!this.mainContainer) return;
    // Recreate UI to update cursor and text display
    if (this.app) {
      this.createAuthenticationUI(this.app, this.mainContainer);
    }
  }

  private async handleLoginSubmit(fields: FormFields): Promise<void> {
    await supabase.auth.signInWithPassword({ email: fields.email, password: fields.password });

    

    // TODO: Implement login logic
    console.log("Login submit:", { email: fields.email, password: fields.password });
  }

  private async handleRegisterSubmit(fields: FormFields): Promise<void> {
    await supabase.auth.signUp({ email: fields.email, password: fields.password });
    

    console.log(supabase.auth);
    // TODO: Implement registration logic
    console.log("Register submit:", { email: fields.email, password: fields.password, confirmPassword: fields.confirmPassword });
  }
}

export async function createAuthenticationView(container: HTMLElement) {
  const config: CanvasConfig = {
    backgroundColor: "#1099bb",
    containerId: AUTHENTICATION_VIEW_ID,
  };

  const contentProvider = new AuthenticationContentProvider();
  return await createCustomCanvas(container, config, contentProvider);
}
