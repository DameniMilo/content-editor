import {ContentPickerSelectorType} from './index';
import {setQueryResponseMock} from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => {
    let queryresponsemock;
    return {
        useQuery: () => queryresponsemock,
        setQueryResponseMock: r => {
            queryresponsemock = r;
        }
    };
});

jest.mock('../PickerContainer', () => {
    return {
        Picker: () => {}
    };
});

describe('ContentPicker config', () => {
    describe('usePickerInputData', () => {
        const usePickerInputData = ContentPickerSelectorType.pickerInput.usePickerInputData;

        it('should return no data, no error when loading', () => {
            setQueryResponseMock({loading: true});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: true, notFound: true});
        });

        it('should return no data when there is no uuid given', () => {
            setQueryResponseMock({loading: false, data: {}});
            expect(usePickerInputData('', {lang: 'fr'})).toEqual({loading: false, notFound: false});
        });

        it('should return error when there is error', () => {
            setQueryResponseMock({loading: false, error: 'oops'});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, error: 'oops', notFound: true});
        });

        it('should return not found when the resource has been removed', () => {
            setQueryResponseMock({loading: false, data: undefined, error: undefined});
            expect(usePickerInputData('uuid', {lang: 'fr'})).toEqual({loading: false, notFound: true});
        });

        it('should adapt data when graphql return some data', () => {
            setQueryResponseMock({loading: false, data: {
                jcr: {
                    result: {
                        displayName: 'a cake',
                        path: 'florent/bestArticles',
                        primaryNodeType: {
                            displayName: 'article',
                            icon: 'anUrl'
                        }
                    }
                }
            }});

            expect(usePickerInputData('this-is-uuid', {lang: 'fr'})).toEqual({
                loading: false,
                error: undefined,
                fieldData: {
                    uuid: 'this-is-uuid',
                    info: 'article',
                    name: 'a cake',
                    path: 'florent/bestArticles',
                    url: 'anUrl.png'
                }
            });
        });
    });
});
