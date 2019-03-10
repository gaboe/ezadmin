import * as React from 'react';
import styled from 'styled-components';
import {
    Container,
    Grid,
    GridRow,
    Pagination
    } from 'semantic-ui-react';

const Wrapper = styled.div`margin-top: 1em;`

const PagePagination: React.FunctionComponent = _ => {
    return (<>
        <Container>
            <Grid textAlign="center">
                <GridRow>
                    <Wrapper>
                        <Pagination
                            activePage={5}
                            boundaryRange={1}
                            // onPageChange={this.handlePaginationChange}
                            siblingRange={1}
                            totalPages={50}
                            firstItem={null}
                            lastItem={null}
                        />
                    </Wrapper>
                </GridRow>
            </Grid>
        </Container>
    </>)
}

export { PagePagination };