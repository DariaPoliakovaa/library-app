export class FormBuilder {
    public static createInput(id: string, placeholder: string, type: string = 'text') {
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-3';
        
        const input = document.createElement('input');
        input.type = type;
        input.id = id;
        input.className = 'form-control';
        input.placeholder = placeholder;
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        
        wrapper.appendChild(input);
        wrapper.appendChild(errorDiv);
        return { wrapper, input, errorDiv };
    }
}
