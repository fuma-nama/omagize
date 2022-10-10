export const avatarStyles = { components: {
        Avatar: {
            baseStyle: (props: any) => ({
                container: {
                    bg: 'brand.300',
                    color: 'white'
                }
            }),
            variants: {
                normal: {
                    container: {
                        border: 0
                    }
                }
            }
        }
    }
}