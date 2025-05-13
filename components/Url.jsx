function Url({ disabled, onClick, children }) {
  return (
    <p className={disabled ? "pointer-events-none opacity-50" : "link"}>
      <a
        onClick={!disabled ? onClick : undefined}
        className={
          !disabled ? undefined : "cursor-not-allowed opacity-50"
        }
      >
        {children}
      </a>
    </p>
  )
}

export default Url