import { expect } from 'chai';
import { Library } from '../src/services/Library';

describe('Library Service', () => {
    interface TestItem {
        id: string;
        name: string;
    }

    let library: Library<TestItem>;

    beforeEach(() => {
        library = new Library<TestItem>();
    });

    it('повинен успішно додавати новий елемент (add)', () => {
        library.add({ id: '1', name: 'Тестова Книга' });
        
        const allItems = library.getAll();
        expect(allItems.length).to.equal(1);
        expect(allItems[0].id).to.equal('1');
    });

    it('повинен знаходити елемент за id (findById)', () => {
        library.add({ id: '1', name: 'Книга 1' });
        library.add({ id: '2', name: 'Книга 2' });

        const foundItem = library.findById('2');
        expect(foundItem).to.not.be.undefined;
        expect(foundItem?.name).to.equal('Книга 2');
    });

    it('повинен видаляти елемент за id (remove)', () => {
        library.add({ id: '1', name: 'Книга 1' });
        library.add({ id: '2', name: 'Книга 2' });

        library.remove('1');
        
        const allItems = library.getAll();
        expect(allItems.length).to.equal(1);
        expect(library.findById('1')).to.be.undefined;
    });
});
